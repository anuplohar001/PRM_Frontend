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


type Member = {
    id: number;
    role: "ORG_OWNER" | "ORG_MEMBER" | "ORG_ADMIN";
    organizationId: number,
    userId: number,
    user: {
        id: number,
        email: string,
        name: string
    };
    addedBy: {
        email: string,
        name: string
    }
    // add other fields if needed
};
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
            apiRequest({
                endpoint: `/projects/get-add-project-member-list/${organization?.id}/${projectId}`,
                method: "GET",
            }),
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
            apiRequest({
                endpoint: `/projects/get-members/${id}`,
                method: "GET",
            }),
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
            apiRequest({
                endpoint: `/projects/add-member`,
                method: "POST",
                body: {
                    projectId: project?.id,
                    memberId: memberId,
                    organizationId: Number(organization.id)
                }
            }),
            () => {
                setShowPopup(false)
            },
            (err) => {
                console.error(err.message)
            }
        )
    }

    const { loading: projectsLoading } = useApiOnLoad<ProjectResponse>(
        () => apiRequest({
            endpoint: `/projects/view-project/${id}`,
            method: "GET",
        }),
        (data) => {
            setProject(data.project)
            if (permissions.includes(Action.ADD_MEMBER)) {                
                getOrgMembers(data.project.id)
                getProjectMembers()
            }
        },
        (err) => {
            console.error(err.message)
        }
    )

    

    const { callApi: updateRole, loading: updatingRole } = useApi()
    const handleRoleChange = (newRole: "PROJECT_MEMBER" | "PROJECT_ADMIN", userId: number, index: number) => {
        updateRole<Member[]>(
            apiRequest({
                endpoint: `/projects/update-member-role`,
                method: "PATCH",
                body: {
                    projectId: Number(id),
                    memberId: userId,
                    role: newRole
                }
            }),
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
        removeMember<Member>(
            apiRequest({
                endpoint: `/projects/remove-member/${id}/${memberId}`,
                method: "DELETE",
            }),
            () => {
            },
            (err) => {
                console.error(err.message)
            }
        )
    };


    const loading = permissionsLoading || projectsLoading || membersLoading || orgMembersLoading || addingMember || updatingRole || removingMember
    return (
        <div className="container mt-1">
            <Loader loading={loading} />

            <div className="card shadow font-size-13">
                <div className="card-header bg-primary-subtle text-muted d-flex justify-content-between">
                    Project Details
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate("/projects")}
                    >
                        ← Back
                    </button>
                </div>

                <div className="card-body">
                    <div className="row mb-2">
                        <div className="col-md-3">
                            <h6>Name:</h6>
                            <p>{project?.name}</p>
                        </div>
                        <div className="col-md-3">
                            <h6>Status:</h6>
                            <span className="badge bg-warning text-dark">
                                {project?.status}
                            </span>
                        </div>
                        <div className="col-md-6 mb-2">
                            <h6>Description:</h6>
                            {project?.description}
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-md-6">
                            <h6>Start Date:</h6>
                            <p>{project?.startDate || "N/A"}</p>
                        </div>
                        <div className="col-md-6">
                            <h6>End Date:</h6>
                            <p>{project?.endDate || "N/A"}</p>
                        </div>
                    </div>

                    <hr />

                    <h5>Created By</h5>
                    <div className="row">
                        <div className="col-md-4">
                            <strong>Name:</strong>
                            <p>{project?.createdBy?.name}</p>
                        </div>
                        <div className="col-md-4">
                            <strong>Email:</strong>
                            <p>{project?.createdBy?.email}</p>
                        </div>
                        <div className="col-md-4">
                            <strong>Role:</strong>
                            <p>PROJECT_ADMIN</p>
                        </div>
                    </div>

                    <hr />

                    <div className="row">
                        <div className="col-md-6">
                            <small className="text-muted">
                                Created At:{" "}
                                {new Date(project?.createdAt ?? "").toLocaleString()}
                            </small>
                        </div>
                        <div className="col-md-6 text-end">
                            <small className="text-muted">
                                Updated At:{" "}
                                {new Date(project?.updatedAt ?? "").toLocaleString()}
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            {permissions.includes(Action.UPDATE_PROJECT_MEMBER_ROLE) && (
                <div className="card shadow-sm mt-3">
                    <div className="card-header fw-semibold">
                        <div className='d-flex justify-content-between'>
                            Project members
                            <button className='btn-primary btn btn-sm'
                                onClick={() => {
                                    setShowPopup(true)
                                    console.log(orgMembers)
                                }}
                            >
                                Add Members +
                            </button>
                        </div>
                    </div>
                    <div className="card-body p-0">

                        {projectMembers.length ? (
                            <table className="table table-sm table-bordered mb-0 font-size-13">
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
                                    {projectMembers.map((member: ProjectMember, index: number) => (
                                        <tr key={member.id}>
                                            <td>{index + 1}</td>
                                            <td>{member.user?.name}</td>
                                            <td>{member.user?.email}</td>
                                            <td>
                                                {user?.id === member.user?.id ? (<span>{member.role}</span>) : (
                                                    <select
                                                        className=" font-size-13"
                                                        value={member?.role}
                                                        onChange={(e) => handleRoleChange(e.target.value, member.user.id, index)}

                                                    >
                                                        <option className='font-size-13' value="PROJECT_MEMBER">PROJECT_MEMBER</option>
                                                        <option className='font-size-13' value="PROJECT_ADMIN">PROJECT_ADMIN</option>
                                                    </select>)}
                                            </td>
                                            <td>
                                                <div className="d-flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger font-size-13"
                                                        onClick={(e) => handleRemoveMember(member.user.id, index)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-muted">No Members</div>
                        )}
                    </div>
                </div>
            )}
            <Popup
                show={showPopup}
                title={`Add member to ${project?.name} project`}
                onClose={() => setShowPopup(false)}
                size='lg'
                buttons={
                    [
                        { label: "Cancel", onClick: () => setShowPopup(false), className: "btn btn-sm btn-secondary" }
                    ]
                }
            >
                <div>
                    {permissions.includes(Action.ADD_PROJECT_MEMBER) && (
                        <div className="col-12 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-header fw-semibold">
                                    <div className='d-flex justify-content-between'>
                                        Organization members
                                    </div>
                                </div>
                                <div className="card-body p-0">

                                    <table className="table mb-0 table-sm font-size-13">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {orgMembers?.length && orgMembers.map((usr) => (
                                                <tr key={usr?.id}>
                                                    <td>{usr?.user?.name}</td>
                                                    <td>{usr?.user?.email}</td>
                                                    <td> {usr.role} </td>
                                                    <td>
                                                        <button className='btn btn-sm btn-primary'
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
                        </div>
                    )}
                </div>
            </Popup>
        </div>
    )
}

export default ViewProject
