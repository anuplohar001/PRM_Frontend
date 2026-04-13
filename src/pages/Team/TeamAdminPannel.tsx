import React, { useEffect, useState } from 'react'
import { useApi } from '../../utils/useApi'
import { apiRequest } from '../../services/api.services'
import Loader from '../../components/Loader/Loader'
import { Eye } from 'react-feather'
import { Link, useNavigate } from 'react-router-dom'
import { useAlert } from '../../components/CustomAlert/AlertContext'




type Team = {
    id: string
    name: string
    projectId: number
    status: string
    role: string
    project:{
        id: number
        name: string
    }
    createdBy: {
        name: string
        email: string
    }
}
type TeamResponse = {
    teams: Team[]
}



const TeamAdminPannel = () => {

    const [teams, setTeams] = useState<Team[]>([])
    const navigate = useNavigate()
    const org = JSON.parse(localStorage.getItem("organization") || "{}")
    const { showAlert } = useAlert();

    const { callApi: fetchAllProjects, loading: fetchingAllProjects } = useApi()
    const getAllProjectsWithTeams = () => {
        console.log("clicked ")
        fetchAllProjects<TeamResponse>(
            apiRequest({
                endpoint: `/teams/${org.id}`,
                method: "GET",
            }),
            (data) => {
                setTeams(data.teams)
            },
            (err) => {
                showAlert({
                    type: "error",
                    message: err.message,
                    showCancel: true,
                    onOk: () => console.log("Deleted"),
                    onCancel: () => console.log("Cancelled"),
                });
                console.error(err.message)
            }
        )
    }

    useEffect(() => {
        if (org.role === "ORG_OWNER") {
            getAllProjectsWithTeams()
        }
    }, [])




    const groupedData = teams.reduce((acc, team) => {
        const projectId = team.projectId;

        if (!acc[projectId]) {
            acc[projectId] = {
                project: team.project,
                teams: []
            };
        }

        acc[projectId].teams.push(team);
        return acc;
    }, {});

    const projects = Object.values(groupedData);


    const loading = fetchingAllProjects
    return (
        <div>
            <Loader loading={loading} />


            <div className="container mt-4">
                <div className="row">
                    {projects.map((item) => (
                        <div className="col-md-6 mb-4" key={item.project.id}>
                            <div className="card shadow-sm h-100">

                                {/* Header */}
                                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-0 text-white">
                                            <Link className='text-decoration-none' to={`/view-project/${item.project.id}`}>
                                                <span className='text-white'>{item.project.name}</span>
                                            </Link>
                                        </h5>
                                        <small>Status: {item.project.status}</small>
                                    </div>
                                    <span className="badge bg-light text-dark">
                                        {item.teams.length} Teams
                                    </span>
                                </div>

                                {/* Body */}
                                <div className="card-body">
                                    <ul className="list-group list-group-flush">
                                        {item.teams.map((team) => (
                                            <li
                                                key={team.id}
                                                className="list-group-item d-flex justify-content-between align-items-center"
                                            >
                                                <div>
                                                    <strong>{team.name}</strong>
                                                    <br />
                                                    <small className="text-muted">
                                                        Created by: {team.createdBy.name}
                                                    </small>
                                                </div>

                                                {/* Eye Icon Button */}
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => navigate(`/view-team/${team.id}`)}
                                                >
                                                    <Eye size={16} />
                                                </button>

                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TeamAdminPannel
