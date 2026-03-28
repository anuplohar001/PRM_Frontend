import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { apiRequest, getRecords } from "../../services/api.services"
import Loader from "../../components/Loader"
import usePermissions from "../../utils/usePermissions"
import { Action } from "../../utils/getAllPermissions"
import { useApi } from "../../utils/useApi"

type Project = {
    id: string
    name: string
    organization: string
    status: string
}
type ProjectResponse = {
    projects: Project[]
}

type ProjectMember = {
    role: "PROJECT_MEMBER" | "PROJECT_ADMIN",
    user : {
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
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [project, setProject] = useState({})
    const [projectMembers, setProjectMembers] = useState<Record<string, ProjectMember[]>>({});
    const [openProjectId, setOpenProjectId] = useState<number | null>()
    const org = JSON.parse(localStorage.getItem('organization'))

    const {
        permissions,
        loading: permissionsLoading,
        // error, 
        // hasAccess 
    } = usePermissions(org?.id);



    const { callApi: fetchProjects, loading: projectsLoading } = useApi()
    const getProjects = () => {
        fetchProjects<ProjectResponse>(
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
    useEffect(() => {
      getProjects()    
    }, [])
    


    const { callApi: fetchMembers, loading: membersLoading } = useApi()
    const getProjectMembers = (projectId:number) => {
        if (projectId === openProjectId) {
            console.log({projectId, openProjectId})
            setOpenProjectId(null)
            return
        }
        if (projectMembers[projectId]) {
            setOpenProjectId(projectId)
            return
        }
        fetchMembers<ProjectMembersResponse>(
            apiRequest({
                endpoint: `/projects/get-members/${projectId}`,
                method: "GET",
            }),
            (data) => {
                setProjectMembers((prev) => ({
                    ...prev,
                    [projectId]: data.members,
                }));
                setOpenProjectId(projectId)
            },
            (err) => {
                console.error(err.message)
            }
        )
    }


    const removeProjMember = async (memberId: number, projectId: number) => {
        setLoading(true)
        try {
            await apiRequest({
                endpoint: `/projects/${projectId}/${memberId}`,
                method: "DELETE",
            })
        } catch (err) {
            if (err && typeof err === 'object' && 'message' in err) {
                // alert(err.message)
                console.error(err.message)
            }
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="container-fluid mt-1 position-relative">
            <Loader loading={loading} />
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h3>Projects Dashboard</h3>
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

                {/* Projects */}
                {permissions.includes(Action.CREATE_PROJECT) && (
                    <div className="col-12 mb-4">
                        <div className="d-flex justify-content-end">
                            <button className="btn-primary btn-sm btn mb-2" onClick={() => navigate('/create-project')}>
                                + Create Project
                            </button>
                        </div>

                        <div className="card shadow-sm">
                            <div className="card-header fw-semibold">
                                Projects List
                            </div>

                            <div className="card-body p-0">
                                <table className="table mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Project</th>
                                            <th>Organization</th>
                                            <th>Created By</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {projects.map(project => (
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

                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-success me-2"
                                                            onClick={() => {
                                                                setShowModal(true)
                                                                setProject(project)
                                                            }}
                                                        >
                                                            Add Member
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => navigate(`/create-project/${project.id}`)}
                                                        >
                                                            Edit
                                                        </button>
                                                    </td>
                                                </tr>

                                                {openProjectId === project.id && (
                                                    <tr>
                                                        <td colSpan={5} className="bg-light p-3">

                                                            {projectMembers[project.id]?.length ? (
                                                                <table className="table table-sm table-bordered mb-0">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="fw-semibold text-muted">#</th>
                                                                            <th className="fw-semibold text-muted">Member Name</th>
                                                                            <th className="fw-semibold text-muted">Email</th>
                                                                            <th className="fw-semibold text-muted">Role</th>
                                                                            <th className="fw-semibold text-muted">Action</th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody>
                                                                        {projectMembers[project.id].map((member: any, index: number) => (
                                                                            <tr key={member.id}>
                                                                                <td>{index + 1}</td>
                                                                                <td>{member.user?.name}</td>
                                                                                <td>{member.user?.email}</td>
                                                                                <td>{member.role || "Member"}</td>
                                                                                <td>
                                                                                    <div className="d-flex flex-wrap gap-2">
                                                                                        <button type="button" className="btn btn-sm btn-success">Change Role</button>
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn btn-sm btn-danger"
                                                                                            onClick={() => removeProjMember(parseInt(member.user.id), parseInt(project.id))}>Remove</button>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            ) : (
                                                                <div className="text-muted">No Members</div>
                                                            )}

                                                        </td>
                                                    </tr>
                                                )}

                                            </React.Fragment>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>


        </div>
    )
}