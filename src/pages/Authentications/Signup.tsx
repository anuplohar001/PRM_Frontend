import React, { useState } from "react"
import { apiRequest } from "../../services/api.services"
import { Link, useNavigate } from "react-router-dom"
import { signupApi } from "../../services/auth.services"
import Loader from "../../components/Loader/Loader"
type SignupForm = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const Signup: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      await signupApi(form)
      navigate('/login')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        alert(err.message)
        console.error(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container position-relative vh-100 d-flex justify-content-center align-items-center">
      <Loader loading={loading} />
      <div className="card shadow p-4" style={{ width: "420px" }}>
        <h3 className="text-center mb-4">Sign Up</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

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

          <div className="mb-3">
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

          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>
        <div className="mt-3">
          Already have an account {" "}
          <Link to={'/login'}>
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup