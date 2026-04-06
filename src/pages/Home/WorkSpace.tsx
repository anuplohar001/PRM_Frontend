import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { apiRequest, getRecords } from "../../services/api.services"
import Loader from "../../components/Loader/Loader"
import { useApiOnLoad } from "../../utils/useApiOnLoad"
import usePermissions from "../../utils/usePermissions"
import Select from "react-select"

type Project = {
  id: string
  name: string
  organization: string
  status: string
}
type ProjectResponse = {
  projects: Project[]
}
type Option = {
  value: string;
  label: string;
};

export default function WorkspaceHome() {

  const navigate = useNavigate()
  const [projects, setProjects] = useState<Option[]>([])
  const org = JSON.parse(localStorage.getItem('organization') || "{}")

  const [selectedProject, setSelectedProject] = useState<Option | null>(null);
  const { permissions, loading: permissionsLoading } = usePermissions(org?.id);



  const { loading: projectsLoading } = useApiOnLoad<ProjectResponse>(
    () => apiRequest({
      endpoint: `/projects/get-my-projects/${org.id}`,
      method: "GET",
    }),
    (data) => {
      setProjects(data.projects.map((proj: Project) => ({
        value: proj.id,
        label: proj.name
      })))
    },
    (err) => {
      console.error(err.message)
    }
  )




  return (
    <div className="container-fluid position-relative">
      {/* <Loader loading={loading} /> */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>Workspace Dashboard</h5>
        <div className="w-25 font-size-13">
          <Select
            options={projects}
            value={selectedProject}
            onChange={(option) => setSelectedProject(option)}
            placeholder="Select a project..."
            isSearchable
          />
        </div>
      </div>


    </div>
  )
}