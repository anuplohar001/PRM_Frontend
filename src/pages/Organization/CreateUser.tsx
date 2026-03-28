import { useState } from "react"
import { apiRequest } from "../../services/api.services"
import { useNavigate } from "react-router-dom"
import { useApi } from "../../utils/useApi"
import Loader from "../../components/Loader"

type CreateUserInput = {
    name: string
    email: string
    description?: string
    password: string
    confirmPassword: string
}

export default function CreateUser() {

    const navigate = useNavigate()
    const organizationId = JSON.parse(localStorage.getItem('organization'))?.id
    const [form, setForm] = useState<CreateUserInput>({
        name: "",
        email: "",
        description: "",
        password: "",
        confirmPassword: ""
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const { callApi: createUser, loading: creatingUser } = useApi()

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        createUser(
            apiRequest({
                endpoint: "/organizations/create-user",
                method: "POST",
                body: { ...form, organizationId },
            }),
            (response) => {
                navigate('/organization')
            },
            (err) => {
                alert(err.message)
                console.error(err.message)
            }
        )
    }

    return (
        <div className="container mt-4">
            <Loader loading={creatingUser} />
            <div className="card shadow-sm">
                <div className="card-header fw-semibold">
                    Create User
                </div>

                <div className="card-body">

                    <form onSubmit={handleSubmit} noValidate>

                        <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="form-control"
                                required
                                placeholder="Full Name"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Email"
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
                                placeholder="Description"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter Password"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Confirm Password</label>
                            <input
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Confirm password"
                            />
                        </div>



                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={()=> navigate('/organization')}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Create User
                            </button>
                        </div>

                    </form>

                </div>
            </div>

        </div>
    )
}