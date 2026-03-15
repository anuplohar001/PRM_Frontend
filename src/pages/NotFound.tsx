import { useNavigate } from "react-router-dom"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">

      <div className="text-center">

        <h1
          className="display-1 fw-bold text-primary"
          style={{ fontSize: "120px" }}
        >
          404
        </h1>

        <h3 className="mb-3 fw-semibold">
          Page Not Found
        </h3>

        <p className="text-muted mb-4">
          The page you are looking for does not exist or has been moved.
        </p>

        <button
          className="btn btn-primary px-4 py-2"
          onClick={() => navigate("/")}
        >
          Go to Home
        </button>

      </div>

    </div>
  )
}

export default NotFound