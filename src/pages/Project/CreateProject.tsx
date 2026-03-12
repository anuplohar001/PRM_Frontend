import { useEffect, useState } from "react"
import { apiRequest, getRecords } from "../../services/api.services"
import { useNavigate } from "react-router-dom"

type Organization = {
    id: string
    name: string
    description: string
    members: number
    projects: number
    role: string
}

type CreateProjectInput = {
    name: string
    organizationId?: number
    description: string
    website: string
    industry: string
    size: string
}


export default function CreateProject() {

    const navigate = useNavigate()
    const [form, setForm] = useState<CreateProjectInput>({
        name: "",
        organizationId:"",
        description: "",
        website: "",
        industry: "",
        size: ""
    })
    const [organizations, setOrganizations] = useState<Organization[]>([])

    const getOrganizations = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"))
            const payload = {
                modelName:'organizations',
                filters: {
                    createdById: user?.id
                }
            }
            const organizations = await getRecords({endpoint:"/getRecords", body: payload})
            if (organizations && typeof organizations === 'object' && 'data' in organizations) {
                
                setOrganizations(organizations?.data as Organization[])
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
      getOrganizations()
    }, [])
    

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        console.log(form)
        try {
            await apiRequest({
                body: { ...form },
                method: "POST",
                endpoint: "/projects/create"
            })
            navigate('/')
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'message' in err) {
                alert(err.message)
                console.error(err.message)
            }
        }

        // call api
    }

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-header fw-semibold">
                    Create Project
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

                            <select
                                name="organizationId"
                                value={form.organizationId}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="">Select Organization</option>

                                {organizations?.map((org) => (
                                    <option key={org?.id} value={org?.id}>
                                        {org?.name}
                                    </option>
                                ))}

                            </select>
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
                                className="btn btn-outline-secondary"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Create Organization
                            </button>
                        </div>

                    </form>

                </div>
            </div>

        </div>
    )
}