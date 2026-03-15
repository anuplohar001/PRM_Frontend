import React, { useEffect, useState } from 'react'
import { apiRequest, getRecords } from '../../services/api.services'
import AddMemberModal from './AddMemberModal'



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

    const [organization, setOrganization] = useState<Organization>()
    const [users, setUsers] = useState()
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const user = JSON.parse(localStorage.getItem("user"))

    const getCurrentOrgDetails = async () => {
        setLoading(true)
        try {
            const orgDetails = {
                endpoint: '/getRecords',
                body: {
                    modelName: 'organizationMembers',
                    filters: { userId: user?.id, role: "ORG_OWNER" },
                    include: {
                        organization: {
                            include: {
                                createdBy: true
                            }
                        }
                    }
                }
            }
            const response = await getRecords(orgDetails)
            const organization = response?.data[0] as Organization
            setOrganization(organization)
            localStorage.setItem("organization", JSON.stringify(organization.organization))
            const organizationId = response?.data[0]?.organizationId
            // console.log(response)
            getOrgMembers(organizationId)
            getExistingUsers(organizationId)
        } catch (err) {
            if (err && typeof err === 'object' && 'message' in err) {
                alert(err.message)
                console.error(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const getOrgMembers = async (organizationId: number) => {
        setLoading(true)
        try {
            const orgDetails = {
                endpoint: '/getRecords',
                body: {
                    modelName: 'organizationMembers',
                    filters: { organizationId: organizationId },
                    include: {
                        user: true
                    }
                }
            }
            const response = await getRecords(orgDetails)
            setMembers(response?.data)
        } catch (err) {
            if (err && typeof err === 'object' && 'message' in err) {
                alert(err.message)
                console.error(err.message)
            }
        } finally {
            setLoading(false)
        }
    }


    const getExistingUsers = async () => {
        setLoading(true)
        try {
            const args = {
                endpoint: '/getRecords',
                body: {
                    modelName: 'users',
                    filters: {
                        organizationMemberships: {
                            none: {}
                        }
                    },

                }
            }
            const response = await getRecords(args)
            console.log(response)
            setUsers(response?.data)
        } catch (err) {
            if (err && typeof err === 'object' && 'message' in err) {
                alert(err.message)
                console.error(err.message)
            }
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getCurrentOrgDetails()
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

    return (
        <div className='row'>
            <div className="col-12 mb-4">
                <div className="card shadow-sm">
                    <div className="card-header">
                        Organization Details
                    </div>

                    <div className="card-body">
                        {organization?.organization ? (
                            <div className="d-flex justify-content-evenly gap-2">

                                <div>
                                    <strong>Organization Name:</strong>{" "}
                                    {organization.organization.name}
                                </div>

                                <div>
                                    <strong>Created By:</strong>{" "}
                                    {organization.organization.createdBy?.name || "N/A"}
                                </div>

                                <div>
                                    <strong>Created At:</strong>{" "}
                                    {new Date(organization.organization.createdAt).toLocaleDateString()}
                                </div>

                            </div>
                        ) : (
                            <span className="text-muted">No organization data</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="col-12 mb-4">
                <div className='d-flex justify-content-end mb-2'>
                    <button className='btn-primary btn btn-sm'
                        onClick={() => setShowModal(true)}
                    >
                        Add Member +
                    </button>
                </div>
                <div className="card shadow-sm">
                    <div className="card-header fw-semibold">
                        Organization Members
                    </div>

                    <div className="card-body p-0">
                        <table className="table mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {members.map(usr => (
                                    <tr key={usr.id}>
                                        <td>{usr.user.name}</td>
                                        <td>{usr.user.email}</td>
                                        <td>{usr.role}</td>
                                        <td>
                                            <div className='d-flex gap-2'>
                                                <button
                                                    className='btn btn-warning btn-sm'
                                                    disabled={usr.id === user.id}
                                                >
                                                    Change Role
                                                </button>
                                                <button
                                                    className='btn btn-danger btn-sm'
                                                    disabled={usr.id === user.id}
                                                >Remove</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>

            <AddMemberModal
                users={users}
                show={showModal}
                onClose={() => setShowModal(false)}
                onAdd={handleAddMember}
                orgName={organization?.organization.name}
            />
        </div>
    )
}

export default Organization
