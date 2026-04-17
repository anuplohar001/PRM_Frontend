import React, { useEffect, useState } from 'react'
import { useApi } from '../../utils/useApi'
import { apiRequest } from '../../services/api.services'
import Loader from '../../components/Loader/Loader'
import { Eye } from 'react-feather'
import { Link, useNavigate } from 'react-router-dom'
import { useAlert } from '../../components/CustomAlert/AlertContext'
import NoData from '../../components/NoData/NoData'

// ✅ TYPES
type TeamMember = {
    id: number
    teamId: number
    userId: number
    role: string
    addedById: number
}

type Team = {
    id: number
    name: string
    projectId: number
    fullTeamAccess: boolean
    members?: TeamMember[]
}

type Project = {
    id: number
    name: string
    fullProjectAccess: boolean
    teams: Team[]
}

type ProjectResponse = {
    result: Project[]
}

const TeamAdminPannel = () => {
    const [projects, setProjects] = useState<Project[]>([])
    const navigate = useNavigate()
    const org = JSON.parse(localStorage.getItem("organization") || "{}")
    const { showAlert } = useAlert()

    const { callApi: fetchProjects, loading } = useApi()

    const getProjectsWithTeams = () => {
        fetchProjects<ProjectResponse>(
            apiRequest({
                endpoint: `/teams/${org.id}`, // ✅ new endpoint
                method: "GET",
            }),
            (data) => {
                console.log(data)
                setProjects(data.result)
            },
            (err) => {
                showAlert({
                    type: "error",
                    message: err.message,
                    showCancel: true,
                })
                console.error(err.message)
            }
        )
    }

    useEffect(() => {
        getProjectsWithTeams()
    }, [])

    return (
        <div>
            <Loader loading={loading} />

            <div className="container mt-4">
                <div className="row">
                    {projects.map((project) => (
                        <div className="col-md-6 mb-4" key={project.id}>
                            <div className="card shadow-sm h-100">

                                {/* Header */}
                                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-0 text-white">
                                            <Link
                                                className="text-decoration-none text-white"
                                                to={`/view-project/${project.id}`}
                                            >
                                                {project.name}
                                            </Link>
                                        </h5>

                                        {/* ✅ Permission badge */}
                                        <small>
                                            {project.fullProjectAccess ? "Admin Access" : "Member Access"}
                                        </small>
                                    </div>

                                    <span className="badge bg-light text-dark">
                                        {project.teams.length} Teams
                                    </span>
                                </div>

                                {/* Body */}
                                <div className="card-body">
                                    <ul className="list-group list-group-flush">
                                        {project.teams.map((team) => (
                                            <li
                                                key={team.id}
                                                className="list-group-item d-flex justify-content-between align-items-center"
                                            >
                                                <div>
                                                    <strong>{team.name}</strong>

                                                    <br />

                                                    {/* ✅ Team access info */}
                                                    <small className="text-muted">
                                                        {team.fullTeamAccess
                                                            ? "Full Access"
                                                            : "Limited Access"}
                                                    </small>
                                                </div>

                                                {/* ✅ All members can view team */}
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

                    {!projects.length && (<NoData/>)}
                </div>
            </div>
        </div>
    )
}

export default TeamAdminPannel