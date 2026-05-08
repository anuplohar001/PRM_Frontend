import React, { useEffect, useState } from 'react'
import { apiRequest } from '../../services/api.services'
import { useApi } from '../../utils/useApi'
import { useNavigate } from 'react-router-dom'
import usePermissions from '../../utils/usePermissions'
import { Action } from '../../utils/getAllPermissions'
import { Trash2, UserPlus } from 'react-feather'
import type { User } from '@/utils/types'
import { useAlert } from '@/components/CustomAlert/AlertContext'

type Member = {
    id: number;
    role: "ORG_OWNER" | "ORG_MEMBER" | "ORG_ADMIN";
    organizationId: number,
    userId: number,
    user: User;
    addedBy: {
        email: string,
        name: string
    }
    // add other fields if needed
};
type MembersResponse = {
    members: Member[]
}

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

    const organization = JSON.parse(localStorage.getItem("organization") || "{}")
    const [members, setMembers] = useState<Member[]>([]);
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const navigate = useNavigate()
    const {showAlert} = useAlert()
    const {
        permissions,
        loading: permissionsLoading,
        // error, 
        // hasAccess 
    } = usePermissions(organization?.id);

    const { callApi: fetchMembers, loading: membersLoading } = useApi()
    const getMembers = () => {
        fetchMembers<MembersResponse>(
            {
                endpoint: `/organizations/get-members/${organization?.id}`,
                method: "GET",
            },
            (data) => {
                setMembers(data.members)
            },
            (err) => {
                console.error(err.message)
            }
        )
    }
    useEffect(() => {
        if (permissions?.includes(Action.GET_MEMBERS_LIST)) {
            getMembers()
        }
    }, [permissions])



    const { callApi: updateRole, loading: updatingRole } = useApi()
    const handleRoleChange = (newRole: "ORG_MEMBER" | "ORG_ADMIN", userId:number, index: number) => {
        updateRole<Member[]>(
            {
                endpoint: `/organizations/update-member-role`,
                method: "PATCH",
                body: {
                    organizationId: organization.id,
                    memberId: userId,
                    role: newRole
                }
            },
            () => {
                setMembers((prev) => {
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
    // console.log(permissions)
const handleDeleteUser = (user: User) => {
    showAlert({
      type: "warning",
      message: (<>
        Are you sure you want to delete <strong> {user.name} </strong> from {organization.name} ?
      </>),
      showCancel: true,
    //   onOk: () => user.id && deleteTask(task.id)
    });
  }
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
                            <div className='d-flex justify-content-between'>
                                Organization members
                                <button className='btn-primary btn btn-sm'
                                    onClick={() => navigate('/create-user')}
                                >
                                   <UserPlus className='text-white me-1' size={15}/> Create User
                                </button>
                            </div>
                        </div>
                        <div className="card-body p-0">

                            <table className="table mb-0 table-sm font-size-13">
                                <thead className="table-light">
                                    <tr>
                                        <th className='ps-4'>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Added By</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {members.map((usr, index) => {
                                        const isCurrentUser = usr.user.id === user?.id

                                        let rowClass = ""

                                        if (isCurrentUser) {
                                            rowClass = "table-primary"          // highest priority
                                        } else if (usr.role === "ORG_OWNER") {
                                            rowClass = "table-warning"
                                        } else if (usr.role === "ORG_ADMIN") {
                                            rowClass = "table-info"
                                        }

                                        return (
                                            <tr key={usr?.id} className={rowClass}>
                                                <td className='ps-4'>{usr?.user?.name}</td>
                                                <td>{usr?.user?.email}</td>

                                                <td className='font-size-13'>
                                                    {usr.role === "ORG_OWNER" || isCurrentUser ? (
                                                        <span>{usr.role}</span>
                                                    ) : (
                                                        <select
                                                            className="font-size-13"
                                                            value={usr?.role}
                                                            onChange={(e) =>
                                                                handleRoleChange(e.target.value, usr.user?.id, index)
                                                            }
                                                        >
                                                            <option value="ORG_MEMBER">ORG_MEMBER</option>
                                                            <option value="ORG_ADMIN">ORG_ADMIN</option>
                                                        </select>
                                                    )}
                                                </td>

                                                <td>{usr?.addedBy?.name}</td>

                                                <td>
                                                    <div className='d-flex gap-2'>
                                                        <button
                                                            className='btn btn-sm border-0'
                                                            disabled={isCurrentUser}
                                                            type='button'
                                                            onClick={()=> handleDeleteUser(usr?.user)}
                                                        >
                                                            <Trash2 className='text-danger' size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Organization
