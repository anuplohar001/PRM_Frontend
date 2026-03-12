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
    return (
        <div
            className="bg-white border-end"
            style={{ width: "220px", minHeight: "100%" }}
        >
            <div className="list-group list-group-flush">

                <Tab to={'/'} label={'WorkSpace'} />
                <Tab to={'/create-organization'} label={'Create Organization'} />
                <Tab to={'/create-project'} label={'Create Project'} />

            </div>
        </div>
    )
}

export default Sidebar