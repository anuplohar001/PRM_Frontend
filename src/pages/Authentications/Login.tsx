import React, { useState } from "react"
import { loginApi } from "../../services/auth.services"
import { apiRequest } from "../../services/api.services"

type LoginForm = {
  email: string
  password: string
}

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const res:unknown = await apiRequest({
        body:{...form},
        method:"POST",
        endpoint:"/users/login"
      })
    } catch (err: Error) {
      console.error("Failed to Login. Please try again")
    }
  }

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Login</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login