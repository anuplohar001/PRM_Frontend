import { useEffect, useState } from "react"
import { apiRequest, getRecords } from "../../services/api.services"
import { useNavigate, useParams } from "react-router-dom"
import { useApi } from "../../utils/useApi"

type Organization = {
    id: string
    name: string
    description: string
    members: number
    projects: number
    role: string
}

type Project = {
    name: string
    organizationId?: number
    description: string
    website: string
    industry: string
    size: string
}


export default function CreateProject() {

    const navigate = useNavigate()
    const organization = JSON.parse(localStorage.getItem('organization') || "{}")
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState<Project>({
        name: "",
        organizationId: organization.id,
        description: "",
        website: "",
        industry: "",
        size: ""
    })

    const getProject = async () => {
        setLoading(true)
        try {
            const args = {
                endpoint: '/getRecords',
                body: {
                    modelName: 'projects',
                    filters: { id: id && parseInt(id) },
                    include: {
                        createdBy: true
                    }
                }
            }
            const response = await getRecords(args)
            const project = response.data[0]
            setForm(project)
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
        if (id) {
            getProject()
        }
    }, [id])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const { callApi: createProject, loading: creatingProject } = useApi()
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        createProject<Project>(
            apiRequest({
                endpoint: id ? `/projects/${id}` : `/projects/create`,
                method: id ? "PUT" : "POST",
                body:{...form}
            }),
            () => {
                navigate("/projects")
            },
            (err) => {
                console.error(err.message)
            }
        )        
    }

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-header fw-semibold">
                    {id ? "Update" : "Create"} Project
                </div>

                <div className="card-body">

                    <form onSubmit={handleSubmit} noValidate>

                        <div className="mb-3">
                            <label className="form-label">Project Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Organization</label>

                            <input
                                name="organization"
                                value={organization.name}
                                className="form-control"
                                required
                                disabled
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="form-control"
                                rows={3}
                            />
                        </div>




                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => navigate('/projects')}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary btn-sm"
                            >
                                {id ? "Update" : "Create"} Project
                            </button>
                        </div>

                    </form>

                </div>
            </div>

        </div>
    )
}