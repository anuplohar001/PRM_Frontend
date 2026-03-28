import { Link } from "react-router-dom"

const Tab = ({ to, label }) => {
    return (
        <Link
            to={to}
            className="list-group-item list-group-item-action"
        >
            {label}
        </Link>
    )
}

const Sidebar = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const role = user.role
    return (
        <div
            className="bg-white border-end"
            style={{ width: "320px", minHeight: "100%" }}
        >
            <div className="list-group list-group-flush">
                {role === 'SUPER_ADMIN' && (
                    <Tab to={'/super-admin-dashboard'} label={'Super Admin Dashboard'} />
                )}
                <Tab to={'/organization'} label={'Organization'} />
                <Tab to={'/'} label={'WorkSpace'} />
                <Tab to={'/project'} label={'Project'} />

            </div>
        </div>
    )
}

export default Sidebar