import React, { useState } from "react"
import { Plus } from "lucide-react"

import useProjects, { useCreateProject } from "@/services/project.service"
import useTeams from "@/services/team.service"

import ProjectTable from "./ProjectTable"
import ProjectFormModal, { ProjectFormData } from "./ProjectFormModal"



const initialFormData: ProjectFormData = {
  name: "",
  description: "",
  teams: [],
}

export default function ProjectsPage() {
  const [open, setOpen] = useState(false)

  const { projects, refetchProjects } = useProjects()
  const { teams, teamsLoading } = useTeams()

  const { createProject, loading: creatingProject } = useCreateProject()

  const organization = localStorage.getItem("lastOrganizationId")

  const [formData, setFormData] =
    useState<ProjectFormData>(initialFormData)

  const [errors, setErrors] = useState<{
    name?: string
    teamIds?: string
  }>({})

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const toggleTeam = (teamId: number) => {
    const team = teams.find(
      (team) => team.id === Number(teamId)
    )

    if (!team) return

    setFormData((prev) => ({
      ...prev,
      teams: prev.teams.some(
        (selectedTeam) => selectedTeam.id === team.id
      )
        ? prev.teams.filter(
          (selectedTeam) => selectedTeam.id !== team.id
        )
        : [...prev.teams, team],
    }))

    if (errors.teamIds) {
      setErrors((prev) => ({
        ...prev,
        teamIds: undefined,
      }))
    }
  }

  const validate = () => {
    const errs: typeof errors = {}

    if (!formData.name.trim()) {
      errs.name = "Project name is required."
    }

    if (formData.teams.length === 0) {
      errs.teamIds = "Select at least one team."
    }

    return errs
  }

  const handleClose = () => {
    setOpen(false)
    setFormData(initialFormData)
    setErrors({})
  }

  const handleSubmit = (
    e: React.SubmitEvent
  ) => {
    e.preventDefault()

    const errs = validate()

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    createProject(
      {
        name: formData.name,
        description: formData.description,
        organizationId: Number(organization),
        teamIds: formData.teams.map((team) => team.id),
      },
      () => {
        handleClose()
        refetchProjects?.()
      }
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Projects
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Manage all your projects in one place
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      <ProjectTable projects={projects} />

      <ProjectFormModal
        open={open}
        onClose={handleClose}
        mode="Create"
        formData={formData}
        errors={errors}
        teams={teams}
        loading={creatingProject}
        onChange={handleChange}
        toggleTeam={toggleTeam}
        onSubmit={handleSubmit}
      />
    </div>
  )
}