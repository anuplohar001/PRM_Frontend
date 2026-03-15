import { useState, useMemo } from "react"

type User = {
    id: string
    name: string
    email: string
}

type Props = {
    users: User[]
    show: boolean
    onClose: () => void
    onAdd: (user: User) => void
}

export default function AddMemberModal({ users=[], show, orgName, onClose, onAdd }: Props) {
    const [search, setSearch] = useState("")

    const filteredUsers = useMemo(() => {
        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, users])

    if (!show) return null

    return (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">Add Member to {orgName}</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">

                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search user by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="text-center text-muted">
                                                No users found
                                            </td>
                                        </tr>
                                    )}

                                    {filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => onAdd(user)}
                                                >
                                                    Add
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}