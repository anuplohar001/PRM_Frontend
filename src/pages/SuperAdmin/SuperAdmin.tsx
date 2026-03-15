import React, { useEffect, useState } from 'react'
import { apiRequest } from '../../services/api.services'


type User = {
    id: string
    name: string
    email: string
    role: string
    createdAt: string
}

type Organization = {
    id: string
    name: string
}

type Project = {
    id: string
    name: string
}

type OrganizationMember = {
    id: string
    userId: string
    organizationId: string
    role: string
}

type ProjectMember = {
    id: string
    userId: string
    projectId: string
    role: string
}

export type SystemData = {
    users: User[]
    organizations: Organization[]
    projects: Project[]
    organizationMembers: OrganizationMember[]
    projectMembers: ProjectMember[]
}

const SuperAdmin = () => {
    const [systemData, setSystemData] = useState<SystemData | null>(null)

    const getSystemData = async () => {
        try {
            
            const response = await apiRequest({
                method: "GET",
                endpoint: "/super-admin/system-data",
            })
            if (response && response as SystemData) {
                setSystemData(response)
            }
            
        } catch (err) {
            if (err && typeof err === 'object' && 'message' in err) {
                alert(err.message)
                console.error(err.message)
            }
        }
    }

    useEffect(() => {
        getSystemData()
    }, [])

    return (
        <div className="container mt-4">
            <h3 className="mb-4">System Overview</h3>

            {!systemData ? (
                <p>System data not available</p>
            ) : (
                <div className="row g-4">

                    <div className="col-md-4">
                        <div className="card p-3">
                            <h5>Total Users</h5>
                            {systemData.users?.length ? (
                                <h4>{systemData.users.length}</h4>
                            ) : (
                                <p>No users found</p>
                            )}
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card p-3">
                            <h5>Total Organizations</h5>
                            {systemData.organizations?.length ? (
                                <h4>{systemData.organizations.length}</h4>
                            ) : (
                                <p>No organizations found</p>
                            )}
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card p-3">
                            <h5>Total Projects</h5>
                            {systemData.projects?.length ? (
                                <h4>{systemData.projects.length}</h4>
                            ) : (
                                <p>No projects found</p>
                            )}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card p-3">
                            <h5>Organization Members</h5>
                            {systemData.organizationMembers?.length ? (
                                <h4>{systemData.organizationMembers.length}</h4>
                            ) : (
                                <p>No organization members</p>
                            )}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card p-3">
                            <h5>Project Members</h5>
                            {systemData.projectMembers?.length ? (
                                <h4>{systemData.projectMembers.length}</h4>
                            ) : (
                                <p>No project members</p>
                            )}
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}

export default SuperAdmin
