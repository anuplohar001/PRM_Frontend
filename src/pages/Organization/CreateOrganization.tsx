import { useState } from "react"
import { apiRequest } from "../../services/api.services"
import { useNavigate } from "react-router-dom"

type CreateOrganizationInput = {
    name: string
    slug?: string
    description: string
    website: string
    industry: string
    size: string
}

export default function CreateOrganization() {

    const navigate = useNavigate()
    const [form, setForm] = useState<CreateOrganizationInput>({
        name: "",
        slug: "",
        description: "",
        website: "",
        industry: "",
        size: ""
    })

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

        try {
            await apiRequest({
                body: { ...form },
                method: "POST",
                endpoint: "/organizations/create"
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
                    Create Organization
                </div>

                <div className="card-body">

                    <form onSubmit={handleSubmit} noValidate>

                        <div className="mb-3">
                            <label className="form-label">Organization Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Slug</label>
                            <input
                                name="slug"
                                value={form.slug}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="techcorp"
                                required
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

                        <div className="mb-3">
                            <label className="form-label">Website</label>
                            <input
                                name="website"
                                value={form.website}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Industry</label>
                            <input
                                name="industry"
                                value={form.industry}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Organization Size</label>

                            <select
                                name="size"
                                value={form.size}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="">Select Size</option>
                                <option value="1-10">1-10</option>
                                <option value="11-50">11-50</option>
                                <option value="51-200">51-200</option>
                                <option value="200+">200+</option>
                            </select>
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