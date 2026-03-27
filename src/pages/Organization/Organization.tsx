import React, { useEffect, useState } from 'react'
import { apiRequest, getRecords } from '../../services/api.services'
import AddMemberModal from './AddMemberModal'
import { useApi } from '../../utils/useApi'
import getActionsFromGroups, { Action } from '../../utils/getAllPermissions'
import { useNavigate } from 'react-router-dom'



type Organization = {
    id: number
    role: string
    userId: number
    organizationId: number
    organization: {
        name: string
    }
}


const Organization = () => {

    const organization = JSON.parse(localStorage.getItem("organization"))
    const [users, setUsers] = useState([])
    const [permissions, setPermissions] = useState([])
    const [members, setMembers] = useState([])
    const [membersAccess, setMembersAccess] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const user = JSON.parse(localStorage.getItem("user"))
    const navigate = useNavigate()

    const { callApi: fetchPermissions, loading: permissionsLoading } = useApi()
    const getPermissions = () => {
        fetchPermissions(
            apiRequest,
            {
                endpoint: `/organizations/permissions/${organization?.id}`,
                method: "GET",
            },
            (response) => {
                const actions = getActionsFromGroups(response?.data?.permissions?.permissions)
                setPermissions(actions)
                setMembersAccess(true)
            },
            (err) => {
                console.error(err.message)
            }
        )
    }

    useEffect(() => {
      getPermissions()
    }, [])
    


    const handleAddMember = async (user: object) => {
        setLoading(true)
        try {
            await apiRequest({
                endpoint: "/organizations/add-member",
                method: "POST",
                body: {
                    memberId: user.id,
                    organizationId: organization?.organizationId
                }
            })
        } catch (err) {
            if (err && typeof err === 'object' && 'message' in err) {
                alert(err.message)
                console.error(err.message)
            }
        } finally {
            setLoading(false)
            setShowModal(false)
        }


    }
    // console.log(permissions)

    return (
        <div className='row'>
            <div className="col-12 mb-4">
                <div className="card shadow-sm">
                    <div className="card-header">
                        Organization Details
                    </div>

                    <div className="card-body">
                        {organization ? (
                            <div className="d-flex justify-content-evenly gap-2">

                                <div>
                                    <strong>Organization Name:</strong>{" "}
                                    {organization.name}
                                </div>

                                <div>
                                    <strong>Created By:</strong>{" "}
                                    {organization.createdBy?.name || "N/A"}
                                </div>

                                <div>
                                    <strong>Created At:</strong>{" "}
                                    {new Date(organization.createdAt).toLocaleDateString()}
                                </div>

                            </div>
                        ) : (
                            <span className="text-muted">No organization data</span>
                        )}
                    </div>
                </div>
            </div>
            {permissions.includes(Action.GET_MEMBERS_LIST) && (
                <div className="col-12 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header fw-semibold">
                            Organization permissions
                        </div>

                        <div className="card-body p-0">
                            <table className="table mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Added By</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {members.map(usr => (
                                        <tr key={usr?.id}>
                                            <td>{usr?.user?.name}</td>
                                            <td>{usr?.user?.email}</td>
                                            <td>{usr?.role}</td>
                                            <td>{usr?.addedBy?.name}</td>
                                            <td>
                                                <div className='d-flex gap-2'>
                                                    <button
                                                        className='btn btn-warning btn-sm'
                                                        disabled={usr?.user?.id === user.id}
                                                    >
                                                        Change Role
                                                    </button>
                                                    <button
                                                        className='btn btn-danger btn-sm'
                                                        disabled={usr?.user?.id === user.id}
                                                    >Remove</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    </div>

                    <div className='d-flex justify-content-center mb-2 mt-2'>
                        <button className='btn-primary btn btn-sm'
                            onClick={() => navigate('/create-user')}
                        >
                            Create User +
                        </button>
                    </div>

                </div>
            )}

            <AddMemberModal
                users={users}
                show={showModal}
                onClose={() => setShowModal(false)}
                onAdd={handleAddMember}
                orgName={organization?.name}
            />
        </div>
    )
}

export default Organization
