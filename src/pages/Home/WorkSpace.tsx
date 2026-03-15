import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { apiRequest, getRecords } from "../../services/api.services"
import Loader from "../../components/Loader"
import AddMemberModal from "../Organization/AddMemberModal"

type Project = {
  id: string
  name: string
  organization: string
  status: string
}

export default function WorkspaceHome() {

  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [orgMembers, setOrgMembers] = useState([])
  const [project, setProject] = useState({})
  const org = JSON.parse(localStorage.getItem('organization'))
  const getProjects = async () => {
    setLoading(true)
    try {
      const args = {
        endpoint: '/getRecords',
        body: {
          modelName: 'projects',
          filters: { organizationId: org.id },
          include: {
            createdBy: true
          }
        }
      }
      const response = await getRecords(args)
      setProjects(response?.data)
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        alert(err.message)
        console.error(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const getOrgMembers = async () => {
    setLoading(true)
    try {
      const args = {
        endpoint: '/getRecords',
        body: {
          modelName: 'organizationMembers',
          filters: { organizationId: org.id },
          include: {
            user: true
          }
        }
      }
      const response = await getRecords(args)
      const users = response?.data.map((m) => m.user)
      setOrgMembers(users)
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        alert(err.message)
        console.error(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProjects()
    getOrgMembers()
  }, [])


  const handleAddProjMember = async (user: object) => {
    console.log(project)
    setLoading(true)
    try {
      await apiRequest({
        endpoint: '/projects/add-member',
        method: "POST",
        body: { projectId: project?.id, memberId: user.id }
      })
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        alert(err.message)
        console.error(err.message)
      }
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="container-fluid mt-1 position-relative">
      <Loader loading={loading} />
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3>Workspace Dashboard</h3>
      </div>

      <div className="row">



        {/* Projects */}
        <div className="col-12 mb-4">
          <div className="d-flex justify-content-end">
            <button className="btn-primary btn-sm btn mb-2" onClick={() => navigate('/create-project')}>
              + Create Project
            </button>
          </div>

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
                    <th>Created By</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {projects.map(project => (
                    <tr key={project.id}>
                      <td>{project.name}</td>
                      <td>{org.name}</td>
                      <td>{project.createdBy.name}</td>
                      <td>
                        <span className="badge bg-success">
                          {project.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-success"
                          onClick={() => {
                            setShowModal(true)
                            setProject(project)
                          }}>Add Member</button>
                        <button className="btn btn-sm btn-primary" onClick={() => navigate(`/create-project/${project.id}`)}>Edit</button>
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
      {/* <div className="card shadow-sm">
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
      </div> */}

      <AddMemberModal
        users={orgMembers}
        show={showModal}
        onClose={() => setShowModal(false)}
        orgName={project?.name}
        onAdd={handleAddProjMember}
      />

    </div>
  )
}