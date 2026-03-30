import React, { useEffect, useState } from 'react'
import { useApi } from '../../utils/useApi'
import { useNavigate, useParams } from 'react-router-dom'
import { apiRequest } from '../../services/api.services'
import type { Project } from './projectUtils'


type ProjectResponse = {
    project: Project
}

const ViewProject = () => {

    const navigate = useNavigate();
    const { id } = useParams()
    const { callApi: fetchProject, loading: projectLoading } = useApi()
    const [project, setProject] = useState<Project>()
    const getProjects = () => {
        fetchProject<ProjectResponse>(
            apiRequest({
                endpoint: `/projects/get-project/${id}`,
                method: "GET",
            }),
            (data) => {
                setProject(data.project)
            },
            (err) => {
                console.error(err.message)
            }
        )
    }
    useEffect(() => {
        getProjects()
    }, [])

    return (
        <div>
            <div className="container mt-1">
                <div className="card shadow">
                    <div className="card-header bg-primary-subtle text-muted d-flex justify-content-between">
                        <h5 className="mb-0">Project Details</h5>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => navigate("/projects")}
                        >
                            ← Back
                        </button>
                    </div>

                    <div className="card-body">
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <h5>Name:</h5>
                                <p>{project?.name}</p>
                            </div>
                            <div className="col-md-6">
                                <h5>Status:</h5>
                                <span className="badge bg-warning text-dark">
                                    {project?.status}
                                </span>
                            </div>
                        </div>

                        <div className="mb-2">
                            <h5>Description:</h5>
                            {project?.description}
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
            </div>
        </div>
    )
}

export default ViewProject
