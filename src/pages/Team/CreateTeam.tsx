
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useApiOnLoad } from "../../utils/useApiOnLoad";
import { apiRequest } from "../../services/api.services";
import Select from "react-select";
import Loader from "../../components/Loader/Loader";
import { useApi } from "../../utils/useApi";
import { useNavigate } from "react-router-dom";


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


const CreateTeam = () => {
    const [teamName, setTeamName] = useState("");
    const [projectId, setProjectId] = useState("");
    const [selectedProject, setSelectedProject] = useState<Option | null>();
    const [adminProjects, setAdminProjects] = useState<Option[]>([])
    const navigate = useNavigate()
    const organization = JSON.parse(localStorage.getItem("organization") || "{}")
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    const { loading: projectsLoading } = useApiOnLoad<ProjectResponse>(
        () => apiRequest({
            endpoint: `/projects/admin/projects`,
            method: "GET",
        }),
        (data) => {
            setAdminProjects(data.projects.map((proj: Project) => ({
                value: proj.id,
                label: proj.name
            })))
        },
        (err) => {
            console.error(err.message)
        }
    )


    // 🔹 Handle Submit
    const { callApi: createTeam, loading: creatingTeam } = useApi()
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!teamName || !projectId) {
            alert("Please fill all fields");
            return;
        }

        createTeam<ProjectResponse>(
            apiRequest({
                endpoint: `/teams/create`,
                method: "POST",
                body: {
                    name: teamName,
                    organizationId: organization?.id, projectId,
                    createdById: user?.id,
                    updatedById: user?.id,
                }
            }),
            () => {
                navigate("/teams")
            },
            (err) => {
                console.error(err.message)
            }
        )

    };


    const loading = projectsLoading || creatingTeam
    return (
        <div className="container mt-2">
            <Loader loading={loading} />
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h4>Create Team</h4>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>

                        {/* Team Name */}
                        <div className="mb-3 font-size-13">
                            <label className="form-label">Team Name</label>
                            <input
                                type="text"
                                className="form-control font-size-13"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                placeholder="Enter team name"
                                required
                            />
                        </div>

                        {/* Project Dropdown */}
                        <div className="mb-3">
                            <label className="form-label">Select Project</label>
                            <div className="font-size-13">
                                <Select
                                    options={adminProjects}
                                    value={selectedProject}
                                    onChange={(option) => {
                                        setSelectedProject(option)
                                        if (option)
                                            setProjectId(option?.value)
                                    }}
                                    placeholder="Select a project in which you are admin"
                                    isSearchable
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Team"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTeam;
