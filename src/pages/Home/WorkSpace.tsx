import React, { useEffect, useState } from "react"
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
  const [assignedProjects, setAssignedProjects] = useState([])
  const [projectMembers, setProjectMembers] = useState([])
  const [openProjectId, setOpenProjectId] = useState<number | null>()
  const org = JSON.parse(localStorage.getItem('organization'))
  const orgRole = org.role
  const orgAdmin = orgRole === "ORG_ADMIN" || orgRole === "ORG_OWNER"





  const getAssignedProjects = async () => {
    try {
      const response = await apiRequest({
        endpoint: '/projects/get-assigned-projects',
        method: "GET",
      })
      setAssignedProjects(response?.data)
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

    getAssignedProjects()

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

  const getProjectMembers = async (projectId: number) => {
    if (openProjectId === projectId) {
      setOpenProjectId(null)
      return
    }
    setOpenProjectId(projectId)
    setLoading(true)
    try {
      if (!projectMembers[projectId]) {
        const args = {
          endpoint: '/getRecords',
          body: {
            modelName: 'projectMembers',
            filters: { projectId },
            include: {
              user: true
            }
          }
        }
        const res = await getRecords(args)
        setProjectMembers(prev => ({
          ...prev,
          [projectId]: res?.data
        }))
      }
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        // alert(err.message)
        console.error(err.message)
      }
    } finally {
      setLoading(false)
    }
  }


  const removeProjMember = async (memberId: number, projectId: number) => {
    setLoading(true)
    try {
      await apiRequest({
        endpoint: `/projects/${projectId}/${memberId}`,
        method: "DELETE",
      })
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        // alert(err.message)
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

        <div className="col-12 mb-4">

          <div className="card shadow-sm">
            <div className="card-header fw-semibold">
              Recent Projects
            </div>

            <div className="card-body p-0">
              <table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Project</th>
                    <th>Assigned By</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {assignedProjects.length > 0 && assignedProjects.map(project => (
                    <React.Fragment key={project.id}>
                      <tr>
                        <td>
                          <span
                            onClick={() => getProjectMembers(parseInt(project.id))}
                            className="me-1 cursor-pointer"
                          >
                            {openProjectId === parseInt(project.id) ? "🔼" : "🔽"}
                          </span>

                          {project.name}
                        </td>

                        <td>{org.name}</td>
                        <td>{project.createdBy.name}</td>

                        <td>
                          <span className="badge bg-success">
                            {project.status}
                          </span>
                        </td>


                      </tr>


                    </React.Fragment>
                  ))}

                  {!assignedProjects.length && (
                    <tr>
                      <td colSpan={4} className="text-muted text-center">No Projects assigned </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          </div>
        </div>

        {/* Projects */}
        {orgAdmin && (
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
                      <React.Fragment key={project.id}>

                        <tr>
                          <td>
                            <span
                              onClick={() => getProjectMembers(parseInt(project.id))}
                              className="me-1 cursor-pointer"
                            >
                              {openProjectId === parseInt(project.id) ? "🔼" : "🔽"}
                            </span>

                            {project.name}
                          </td>

                          <td>{org.name}</td>
                          <td>{project.createdBy.name}</td>

                          <td>
                            <span className="badge bg-success">
                              {project.status}
                            </span>
                          </td>

                          <td>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => {
                                setShowModal(true)
                                setProject(project)
                              }}
                            >
                              Add Member
                            </button>

                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => navigate(`/create-project/${project.id}`)}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>

                        {openProjectId === project.id && (
                          <tr>
                            <td colSpan={5} className="bg-light p-3">

                              {projectMembers[project.id]?.length ? (
                                <table className="table table-sm table-bordered mb-0">
                                  <thead>
                                    <tr>
                                      <th className="fw-semibold text-muted">#</th>
                                      <th className="fw-semibold text-muted">Member Name</th>
                                      <th className="fw-semibold text-muted">Email</th>
                                      <th className="fw-semibold text-muted">Role</th>
                                      <th className="fw-semibold text-muted">Action</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {projectMembers[project.id].map((member: any, index: number) => (
                                      <tr key={member.id}>
                                        <td>{index + 1}</td>
                                        <td>{member.user?.name}</td>
                                        <td>{member.user?.email}</td>
                                        <td>{member.role || "Member"}</td>
                                        <td>
                                          <div className="d-flex flex-wrap gap-2">
                                            <button type="button" className="btn btn-sm btn-success">Change Role</button>
                                            <button
                                              type="button"
                                              className="btn btn-sm btn-danger"
                                              onClick={() => removeProjMember(parseInt(member.user.id), parseInt(project.id))}>Remove</button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <div className="text-muted">No Members</div>
                              )}

                            </td>
                          </tr>
                        )}

                      </React.Fragment>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
          </div>
        )}
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