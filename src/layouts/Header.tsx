import { Link, useNavigate } from "react-router-dom"

const Header = () => {
    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem("user") || "{}")

    const handleLogout = () => {
        localStorage.clear()
        navigate("/login")
    }

    return (
        <nav className="navbar navbar-light bg-primary-subtle px-3">

            <span className="navbar-brand mb-0 h5">
                PRM Tool
            </span>

            <div className="dropdown">

                <button
                    className="btn btn-primary btn-sm dropdown-toggle"
                    data-bs-toggle="dropdown"
                >
                    {user?.name}
                </button>

                <ul className="dropdown-menu dropdown-menu-end">

                    <li>
                        <Link to={'/profile'}>
                            <button className="dropdown-item">Profile</button>
                        </Link>
                    </li>

                    <li>
                        <button onClick={handleLogout} type="button" className="dropdown-item">Logout</button>
                    </li>

                </ul>

            </div>

        </nav>
    )
}

export default Header