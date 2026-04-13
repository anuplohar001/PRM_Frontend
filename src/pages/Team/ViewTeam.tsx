import React, { useEffect, useState } from 'react'
import { useApi } from '../../utils/useApi'
import { apiRequest } from '../../services/api.services'
import Loader from '../../components/Loader/Loader'
import { useNavigate, useParams } from 'react-router-dom'
import usePermissions from '../../utils/usePermissions'
import { Action } from '../../utils/getAllPermissions'
import Popup from '../../components/PopupModal/PopupModal'
import { Eye } from 'react-feather'


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


type Team = {
    id: string
    name: string
    projectId: number
    organizationId: number
    status: string
    role: string
    project: {
        id: number
        name: string
        status: string
    }
    createdBy: {
        name: string
        email: string
    }
    updatedBy: {
        name: string
        email: string
    }
}
type TeamMember = {
    id: number;
    teamId: number;
    userId: number;
    role: "TEAM_ADMIN" | "TEAM_MEMBER"; // adjust if you have more roles
    addedById: number;

    member: {
        id: number;
        name: string;
        email: string;
        description: string | null;
        password: string;
        role: "USER" | "ADMIN"; // adjust based on your system
        createdAt: string; // ISO date string
        updatedAt: string;
        createdById: number | null;
        updatedById: number | null;
    };
};
type TeamResponse = {
    team: Team
    teamMembers: TeamMember[]
}

type AddTeamMemberResponse = {
    member: TeamMember
    available: boolean
}

const ViewTeam = () => {

    const [team, setTeam] = useState<Team>()
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>()
    const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([])
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const navigate = useNavigate()
    const { id } = useParams()
    const org = JSON.parse(localStorage.getItem('organization') || "{}")
    const teamId = Number(id)
    const { permissions, loading: permissionsLoading } = usePermissions(teamId, "TEAM");
    const { callApi: fetchTeam, loading: fetchingTeam } = useApi()
    const getTeamDetails = () => {
        fetchTeam<TeamResponse>(
            apiRequest({
                endpoint: `/teams/view-team/${teamId}`,
                method: "GET",
            }),
            (data) => {
                setTeam(data.team)
                setTeamMembers(data.teamMembers)
            },
            (err) => {
                console.error(err.message)
            }
        )
    }

    useEffect(() => {
        getTeamDetails()
    }, [])



    const { callApi: fetchProjectMembers, loading: membersLoading } = useApi()
    const getAvailableMembers = () => {
        setProjectMembers([])
        fetchProjectMembers<ProjectMembersResponse>(
            apiRequest({
                endpoint: `/teams/get-add-team-member-list/${org.id}/${team?.projectId}/${teamId}`,
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
    const addMemberToTeam = (memberId: number) => {
        addMember<AddTeamMemberResponse>(
            apiRequest({
                endpoint: `/teams/add-member`,
                method: "POST",
                body: {
                    teamId: team?.id,
                    userId: memberId,
                    organizationId: Number(org.id)
                }
            }),
            (data) => {
                if (!data.available) {
                    alert("User is already member of another team")
                    return
                }
                setShowPopup(false)
            },
            (err) => {
                console.error(err.message)
            }
        )
    }



    const loading = fetchingTeam || permissionsLoading || addingMember || membersLoading
    return (
        <div className="container">
            <Loader loading={loading} />

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-semibold">Team Details</h5>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>
            </div>

            {team && (
                <div className="card shadow-sm border">
                    <div className="card-body">

                        {/* Team Basic Info */}
                        <div className="mb-4">
                            <h5 className="text-primary fw-semibold">{team.name}</h5>
                            <p className="text-muted mb-1">Team ID: {team.id}</p>
                            <p className="text-muted">Organization ID: {team.organizationId}</p>
                        </div>

                        <div className="row g-3">

                            {/* Project Card */}
                            <div className="col-md-6">
                                <div className="card h-100 border bg-light">
                                    <div className='card-header d-flex justify-content-between align-items-center'>
                                        <div className='card-title'>
                                            <h6 className="fw-bold">📁 Project</h6>
                                        </div>
                                        <div>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                title='View project details'
                                                onClick={() => navigate(`/view-project/${team.projectId}`)}
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <p className="mb-1"><strong>Name:</strong> {team.project?.name}</p>
                                        <p className="mb-1"><strong>Status:</strong>
                                            <span className="badge bg-info ms-2">
                                                {team.project?.status}
                                            </span>
                                        </p>
                                        <p className="text-muted small">
                                            {team.project?.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Created By */}
                            <div className="col-md-6">
                                <div className="card h-100 border bg-light">
                                    <div className="card-body">
                                        <h6 className="fw-bold mb-2">👤 Created By</h6>
                                        <p className="mb-1">{team.createdBy?.name}</p>
                                        <p className="text-muted small">{team.createdBy?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Updated By */}
                            <div className="col-md-6">
                                <div className="card h-100 border bg-light">
                                    <div className="card-body">
                                        <h6 className="fw-bold mb-2">✏️ Updated By</h6>
                                        <p className="mb-1">{team.updatedBy?.name}</p>
                                        <p className="text-muted small">{team.updatedBy?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="col-md-6">
                                <div className="card h-100 border bg-light">
                                    <div className="card-body">
                                        <h6 className="fw-bold mb-2">⏱ Timeline</h6>
                                        <p className="mb-1">
                                            <strong>Created:</strong>{" "}
                                            {new Date(team.createdAt).toLocaleString()}
                                        </p>
                                        <p className="mb-0">
                                            <strong>Updated:</strong>{" "}
                                            {new Date(team.updatedAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
            {permissions.includes(Action.GET_TEAM_MEMBERS) && teamMembers && teamMembers.length > 0 && (
                <div className="card shadow-sm border mt-4">
                    <div className="card-body">
                        <div className='d-flex justify-content-between'>
                            <h6 className="fw-semibold">Team Memebers</h6>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                    setShowPopup(!membersLoading)
                                    getAvailableMembers()
                                }}
                            >
                                + Add Member
                            </button>
                        </div>

                        <div className="row g-3">
                            {teamMembers && teamMembers.map((tm) => (
                                <div key={tm.id} className="col-md-6 col-lg-4">
                                    <div className="card border bg-light h-100">
                                        <div className="card-body">

                                            {/* Member Info */}
                                            <h6 className="fw-bold mb-1">{tm.member.name}</h6>
                                            <p className="text-muted small mb-2">
                                                {tm.member.email}
                                            </p>

                                            {/* Role Badge */}
                                            <span className="badge bg-primary mb-2">
                                                {tm.role}
                                            </span>

                                            {/* Extra Info */}
                                            <p className="small mb-1">
                                                <strong>User ID:</strong> {tm.userId}
                                            </p>
                                            <p className="small mb-0 text-muted">
                                                Added By: {tm.addedById}
                                            </p>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}




            <Popup
                show={showPopup}
                title={`Add member to ${team?.name} team`}
                onClose={() => setShowPopup(false)}
                size='lg'
                buttons={
                    [
                        { label: "Cancel", onClick: () => setShowPopup(false), className: "btn btn-sm btn-secondary" }
                    ]
                }
            >
                <div>
                    {permissions.includes(Action.ADD_TEAM_MEMBER) && (
                        <div className="col-12 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-header fw-semibold">
                                    <div className='d-flex justify-content-between'>
                                        {team?.project.name} project members
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
                                            {projectMembers?.length ? (<>
                                                {projectMembers.map((usr) => (
                                                    <tr key={usr?.id}>
                                                        <td>{usr?.user?.name}</td>
                                                        <td>{usr?.user?.email}</td>
                                                        <td> {usr.role} </td>
                                                        <td>
                                                            <button className='btn btn-sm btn-primary'
                                                                onClick={() => addMemberToTeam(usr.user.id)}
                                                            >
                                                                + Add
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>) : (<tr>
                                                <td colSpan={4} className='text-center'>
                                                    No members are available in {" "}
                                                    <strong>{team?.project.name}</strong> project
                                                </td>
                                            </tr>)
                                            }


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

export default ViewTeam
