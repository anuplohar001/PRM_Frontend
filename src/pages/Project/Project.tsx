import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiRequest } from "../../services/api.services"
import Loader from "../../components/Loader/Loader"
import usePermissions from "../../utils/usePermissions"
import { Action } from "../../utils/getAllPermissions"
import { useApi } from "../../utils/useApi"
import { useApiOnLoad } from "../../utils/useApiOnLoad"

type Project = {
    id: string
    name: string
    organization: string
    status: string
    role: string
    createdBy: {
        name: string
        email: string
    }
}
type ProjectResponse = {
    projects: Project[]
}

type ProjectMember = {
    role: "PROJECT_MEMBER" | "PROJECT_ADMIN",
    user: {
        name: string,
        email: string
    }
}

type ProjectMembersResponse = {
    members: ProjectMember[]
}

export default function Project() {

    const navigate = useNavigate()
    const [projects, setProjects] = useState<Project[]>([])
    const [myProjects, setMyProjects] = useState<Project[]>([])
    const org = JSON.parse(localStorage.getItem('organization') || "{}")

    const { permissions, loading: permissionsLoading } = usePermissions(org?.id, "ORGANIZATION");

    const { callApi: fetchAllProjects, loading: fetchingAllProjects } = useApi()
    const getAllProjects = () => {
        fetchAllProjects<ProjectResponse>(
            apiRequest({
                endpoint: `/projects/${org.id}`,
                method: "GET",
            }),
            (data) => {
                setProjects(data.projects)
            },
            (err) => {
                console.error(err.message)
            }
        )
    }

    const { callApi: fetchMyProjects, loading: fetchingMyProjects } = useApi()
    const getMyProjects = () => {
        fetchMyProjects<ProjectResponse>(
            apiRequest({
                endpoint: `/projects/get-my-projects/${org.id}`,
                method: "GET",
            }),
            (data) => {
                setProjects(data.projects)
            },
            (err) => {
                console.error(err.message)
            }
        )
    }


    useEffect(() => {
        if (permissions) {
            if (permissions.includes(Action.GET_PROJECTS)) {
                getAllProjects()
            } else {
                getMyProjects()
            }
        }
    }, [permissions])



    const loading = permissionsLoading || fetchingAllProjects || fetchingMyProjects


    return (
        <div className="container-fluid mt-1 position-relative">
            <Loader loading={loading} />
            <div className="d-flex justify-content-between align-items-center mb-1">
                <h5>Projects Dashboard</h5>
            </div>

            <div className="row">

                {/* <div className="col-12 mb-4">

                    <div className="card shadow-sm">
                        <div className="card-header fw-semibold">
                            Recent Projects
                        </div>

                        <div className="card-body p-0">
                            <table className="table mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Project</th>
                                        <th>Assigned By</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {assignedProjects.length > 0 && assignedProjects.map(project => (
                                        <React.Fragment key={project.id}>
                                            <tr>
                                                <td>
                                                    <span
                                                        onClick={() => getProjectMembers(parseInt(project.id))}
                                                        className="me-1 cursor-pointer"
                                                    >
                                                        {openProjectId === parseInt(project.id) ? "🔼" : "🔽"}
                                                    </span>

                                                    {project.name}
                                                </td>

                                                <td>{org.name}</td>
                                                <td>{project.createdBy.name}</td>

                                                <td>
                                                    <span className="badge bg-success">
                                                        {project.status}
                                                    </span>
                                                </td>


                                            </tr>


                                        </React.Fragment>
                                    ))}

                                    {!assignedProjects.length && (
                                        <tr>
                                            <td colSpan={4} className="text-muted text-center">No Projects assigned </td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div> */}

                <div className="col-12 mb-4">

                    <div className="card shadow-sm">
                        <div className="card-header fw-semibold d-flex justify-content-between">
                            {permissions.includes(Action.CREATE_PROJECT) ? (<>
                                Projects List
                                <button className="btn-primary btn-sm btn" onClick={() => navigate('/create-project')}>
                                    + Create Project
                                </button>
                            </>) : (<>My Projects</>)}
                        </div>

                        <div className="card-body p-0">
                            <table className="table mb-0 table-sm font-size-13 table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Project</th>
                                        <th>Organization</th>
                                        <th>Created By</th>
                                        <th>My Role</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {projects?.map((project, idx) => (
                                        <React.Fragment key={project.id}>

                                            <tr>
                                                <td>
                                                    {idx + 1}
                                                </td>
                                                <td>
                                                    {project?.name}
                                                </td>

                                                <td>{org.name}</td>
                                                <td>{project?.createdBy.name}</td>

                                                <td>
                                                    {project?.role}
                                                </td>
                                                <td>
                                                    <span className="badge bg-success">
                                                        {project?.status}
                                                    </span>
                                                </td>

                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-success me-2"
                                                        title="View project"
                                                        onClick={() => navigate(`/view-project/${project.id}`)}
                                                    >
                                                        👁️
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => navigate(`/update-project/${project.id}`)}
                                                        title="Edit project"
                                                    >
                                                        ✏️
                                                    </button>
                                                </td>
                                            </tr>

                                        </React.Fragment>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>




            </div>


        </div>
    )
}