import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getRecords } from "../../services/api.services"

type Organization = {
  id: string
  name: string
  description: string
  members: number
  projects: number
  role: string
}

type Project = {
  id: string
  name: string
  organization: string
  status: string
}

export default function WorkspaceHome() {

  const [organizations, setOrganizations] = useState<Organization[]>([
    { id: "1", name: "TechCorp", members: 12, projects: 6, role: "Owner" },
    { id: "2", name: "StartupHub", members: 5, projects: 2, role: "Admin" }
  ])

  const [projects] = useState<Project[]>([
    { id: "1", name: "PRM Tool", organization: "TechCorp", status: "Active" },
    { id: "2", name: "Website Revamp", organization: "StartupHub", status: "Planning" }
  ])

  const [loading, setLoading] = useState(true)


  const getOrganizations = async () => {
    try {
      const body = {modelName: 'organizations'}
      const res = await getRecords({
        body,
        endpoint: "/getRecords"
      })
      if (res && typeof res === 'object' && 'data' in res) {
        const data = res?.data as Organization[]
        setOrganizations(data)
      }
      
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getOrganizations()
  }, [])
  

  return (
    <div className="container-fluid mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Workspace Dashboard</h3>       
      </div>

      <div className="row">

        {/* Organizations */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header fw-semibold">
              Your Organizations
            </div>

            <div className="card-body p-0">
              <table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Projects</th>
                    <th>Role</th>
                  </tr>
                </thead>

                <tbody>
                  {organizations.map(org => (
                    <tr key={org.id}>
                      <td>{org.name}</td>
                      <td>{org.description}</td>
                      <td>{org.projects}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {org.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header fw-semibold">
              Recent Projects
            </div>

            <div className="card-body p-0">
              <table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Project</th>
                    <th>Organization</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {projects.map(project => (
                    <tr key={project.id}>
                      <td>{project.name}</td>
                      <td>{project.organization}</td>
                      <td>
                        <span className="badge bg-success">
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity */}
      <div className="card shadow-sm">
        <div className="card-header fw-semibold">
          Recent Activity
        </div>

        <div className="card-body">
          <ul className="list-group list-group-flush">

            <li className="list-group-item">
              Anup created project <strong>PRM Tool</strong>
            </li>

            <li className="list-group-item">
              Rohit invited Neha to <strong>TechCorp</strong>
            </li>

            <li className="list-group-item">
              Neha created task <strong>Design UI</strong>
            </li>

          </ul>
        </div>
      </div>

    </div>
  )
}