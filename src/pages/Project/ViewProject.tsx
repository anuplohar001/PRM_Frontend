import React, { useEffect, useState } from 'react'
import { useApi } from '../../utils/useApi'
import { useNavigate, useParams } from 'react-router-dom'
import { apiRequest } from '../../services/api.services'
import type { Project } from './projectUtils'
import { useApiOnLoad } from '../../utils/useApiOnLoad'
import usePermissions from '../../utils/usePermissions'
import Loader from '../../components/Loader/Loader'
import Popup from '../../components/PopupModal/PopupModal'
import { Action } from '../../utils/getAllPermissions'
import { Trash2 } from 'react-feather'
import { useAlert } from '../../components/CustomAlert/AlertContext'
import type { Member } from '../../utils/types'


type MembersResponse = {
    members: Member[]
}

type ProjectResponse = {
    project: Project
}
type MyProjectResponse = {
    projects: Project[]
}

type ProjectMember = {
    id: number,
    role: "PROJECT_MEMBER" | "PROJECT_ADMIN",
    user: {
        id: number,
        name: string,
        email: string
    }
}

type ProjectMembersResponse = {
    members: ProjectMember[]
}

const ViewProject = () => {

    const organization = JSON.parse(localStorage.getItem("organization") || "{}")
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const navigate = useNavigate();
    const { id } = useParams()
    const {showAlert} = useAlert()
    const [project, setProject] = useState<Project>()
    const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([])
    const [orgMembers, setOrgMembers] = useState<Member[]>()
    const [showPopup, setShowPopup] = useState(false)
    const {
        permissions,
        loading: permissionsLoading,
    } = usePermissions(Number(id), "PROJECT");


    const { callApi: fetchMembers, loading: orgMembersLoading } = useApi()
    const getOrgMembers = (projectId: number) => {
        fetchMembers<MembersResponse>(
            {
                endpoint: `/projects/get-add-project-member-list/${organization?.id}/${projectId}`,
                method: "GET",
            },
            (data) => {
                setOrgMembers(data.members)
            },
            (err) => {
                console.error(err.message)
            }
        )
    }

    const { callApi: fetchProjectMembers, loading: membersLoading } = useApi()
    const getProjectMembers = () => {
        fetchProjectMembers<ProjectMembersResponse>(
            {
                endpoint: `/projects/get-members/${id}`,
                method: "GET",
            },
            (data) => {
                setProjectMembers(data.members)
            },
            (err) => {
                console.error(err.message)
            }
        )
    }

    const { callApi: addMember, loading: addingMember } = useApi()
    const addMemberToProject = (memberId: number) => {
        addMember<MembersResponse>(
            {
                endpoint: `/projects/add-member`,
                method: "POST",
                body: {
                    projectId: project?.id,
                    memberId: memberId,
                    organizationId: Number(organization.id)
                }
            },
            () => {
                setShowPopup(false)
            },
            (err) => {
                console.error(err.message)
            }
        )
    }

    const { loading: projectsLoading } = useApiOnLoad<ProjectResponse>(
        {
            endpoint: `/projects/view-project/${id}`,
            method: "GET",
        },
        (data) => {
            setProject(data.project)            
        },
        (err) => {
            console.error(err.message)
        }
    )


    useEffect(() => {
        if (permissions.includes(Action.ADD_PROJECT_MEMBER) && project) {
            getOrgMembers(project.id)
            getProjectMembers()
        }
    }, [permissions, project])
    
    

    const { callApi: updateRole, loading: updatingRole } = useApi()
    const handleRoleChange = (newRole: "PROJECT_MEMBER" | "PROJECT_ADMIN", userId: number, index: number) => {
        updateRole<Member[]>(
            {
                endpoint: `/projects/update-member-role`,
                method: "PATCH",
                body: {
                    projectId: Number(id),
                    memberId: userId,
                    role: newRole
                }
            },
            () => {
                setProjectMembers((prev) => {
                    const updatedMembers = [...prev]
                    updatedMembers[index] = {
                        ...updatedMembers[index],
                        role: newRole
                    }
                    return updatedMembers
                })
            },
            (err) => {
                console.error(err.message)
            }
        )
    };


    const { callApi: removeMember, loading: removingMember } = useApi()
    const handleRemoveMember = (memberId: number) => {
        if (!permissions.includes(Action.REMOVE_PROJECT_MEMBER) || projectMembers.length === 1) {
            return
        }
        removeMember<Member>(
            {
                endpoint: `/projects/remove-member/${id}/${memberId}`,
                method: "DELETE",
            },
            () => {
            },
            (err) => {
                console.error(err.message)
            }
        )
    };


    const loading = permissionsLoading || projectsLoading || membersLoading || orgMembersLoading || addingMember || updatingRole || removingMember
    return (
        <div className="container py-3">
            <Loader loading={loading} />

            {/* 🔹 HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4 className="mb-0">{project?.name}</h4>
                    <small className="text-muted">Project Overview</small>
                </div>

                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>
            </div>

            {/* 🔹 PROJECT INFO */}
            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body">

                    <div className="row g-4">

                        <div className="col-md-3">
                            <div className="text-muted small">Status</div>
                            <span className="badge bg-warning text-dark mt-1 px-3 py-2">
                                {project?.status}
                            </span>
                        </div>

                        <div className="col-md-3">
                            <div className="text-muted small">Start Date</div>
                            <div>{project?.startDate || "—"}</div>
                        </div>

                        <div className="col-md-3">
                            <div className="text-muted small">End Date</div>
                            <div>{project?.endDate || "—"}</div>
                        </div>

                        <div className="col-md-12">
                            <div className="text-muted small">Description</div>
                            <div className="mt-1">{project?.description || "No description"}</div>
                        </div>

                    </div>

                    <hr />

                    {/* 🔹 CREATED BY */}
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <div className="fw-semibold">{project?.createdBy?.name}</div>
                            <small className="text-muted">{project?.createdBy?.email}</small>
                        </div>

                        <span className="badge bg-light text-dark border">
                            PROJECT_ADMIN
                        </span>
                    </div>

                    <div className="d-flex justify-content-between mt-3 text-muted small">
                        <span>
                            Created: {new Date(project?.createdAt ?? "").toLocaleString()}
                        </span>
                        <span>
                            Updated: {new Date(project?.updatedAt ?? "").toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* 🔹 MEMBERS */}
            {permissions.includes(Action.UPDATE_PROJECT_MEMBER_ROLE) && (
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Members</h6>

                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setShowPopup(true)}
                        >
                            + Add Member
                        </button>
                    </div>

                    <div className="card-body p-0">

                        {projectMembers.length ? (
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Member</th>
                                        <th>Role</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {projectMembers.map((member, index) => (
                                        <tr key={member.id}>
                                            <td className="text-muted">{index + 1}</td>

                                            <td>
                                                <div className="fw-semibold">
                                                    {member.user?.name}
                                                </div>
                                                <small className="text-muted">
                                                    {member.user?.email}
                                                </small>
                                            </td>

                                            <td>
                                                {(user?.id === member.user?.id) || (project?.createdBy.id === member.user?.id) ? (
                                                    <span className="badge bg-light text-dark border">
                                                        {member.role}
                                                    </span>
                                                ) : (
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={member.role}
                                                        onChange={(e) =>
                                                            handleRoleChange(
                                                                e.target.value,
                                                                member.user.id,
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <option value="PROJECT_MEMBER">Member</option>
                                                        <option value="PROJECT_ADMIN">Admin</option>
                                                    </select>
                                                )}
                                            </td>

                                            <td className="text-end">
                                                <button
                                                    className="btn btn-sm btn-light"
                                                    onClick={() =>
                                                        showAlert({
                                                            message:`Are you sure you want to remove ${member.user.name} from ${project?.name} ?`,
                                                            onOk: () => handleRemoveMember(member.user.id) ,
                                                            showCancel:true
                                                        })        
                                                    }
                                                >
                                                    <Trash2 size={15} className="text-danger" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center text-muted py-4">
                                No members added yet
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 🔹 POPUP */}
            <Popup
                show={showPopup}
                title={`Add member`}
                onClose={() => setShowPopup(false)}
                size="lg"
                buttons={[
                    {
                        label: "Close",
                        onClick: () => setShowPopup(false),
                        className: "btn btn-secondary btn-sm",
                    },
                ]}
            >
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white fw-semibold">
                        Organization Members
                    </div>

                    <div className="card-body p-0">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Member</th>
                                    <th>Role</th>
                                    <th className="text-end">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orgMembers?.map((usr) => (
                                    <tr key={usr.id}>
                                        <td>
                                            <div className="fw-semibold">
                                                {usr.user?.name}
                                            </div>
                                            <small className="text-muted">
                                                {usr.user?.email}
                                            </small>
                                        </td>

                                        <td>{usr.role}</td>

                                        <td className="text-end">
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => addMemberToProject(usr.user.id)}
                                            >
                                                + Add
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Popup>
        </div>
    )
}

export default ViewProject
