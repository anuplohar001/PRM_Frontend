import { Link } from "react-router-dom"
import {
    Home,
    Grid,
    Folder,
    Users,
    Activity,
    Shield
} from "react-feather"
import { NavLink } from "react-router-dom"

const Tab = ({ to, label, Icon }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `list-group-item list-group-item-action d-flex align-items-center gap-2 ${isActive ? "bg-secondary-subtle fw-medium" : ""
                }`
            }
        >
            {Icon && <Icon size={16} />}
            {label}
        </NavLink>
    )
}

const Sidebar = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const role = user.role

    return (
        <div
            className="bg-white border-end d-flex flex-column"
            style={{ width: "320px", minHeight: "75vh" }}
        >
            <div className="list-group list-group-flush">
                {role === "SUPER_ADMIN" && (
                    <Tab
                        to="/super-admin-dashboard"
                        label="Super Admin Dashboard"
                        Icon={Shield}
                    />
                )}

                <Tab to="/organization" label="Organization" Icon={Grid} />
                <Tab to="/" label="WorkSpace" Icon={Home} />
                <Tab to="/projects" label="Projects" Icon={Folder} />
                <Tab to="/teams" label="Teams" Icon={Users} />
            </div>

            {/* Bottom item */}
            <div className="list-group list-group-flush mt-auto">
                <Tab
                    to="/recent-activities"
                    label="Recent Activities"
                    Icon={Activity}
                />
            </div>
        </div>
    )
}

export default Sidebar