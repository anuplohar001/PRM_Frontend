import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApiOnLoad } from "../../utils/useApiOnLoad"
import usePermissions from "../../utils/usePermissions"
import Select from "react-select"
import { useApi } from "../../utils/useApi"
import { useAlert } from "../../components/CustomAlert/AlertContext"
import Loader from "../../components/Loader/Loader"
import { Edit2, Trash2 } from "react-feather";
import OptionsMenu from "../../components/CustomDialogBox/OptionsMenu"
import Popup from "../../components/PopupModal/PopupModal"
import CreateTaskForm from "./CreateTask"
import { type Option, type Task, type Workflow } from "../../utils/types"
type Project = {
  id: string
  name: string
  organization: string
  status: string
}
type ProjectResponse = {
  projects: Project[]
}



type ProjectWorkflowResponse = {
  workflows: Workflow[]
}

type TasksResponse = {
  tasks: Task[]
}
type CreateTasksResponse = {
  task: Task
}

export default function WorkspaceHome() {


  const navigate = useNavigate()
  const org = JSON.parse(localStorage.getItem('organization') || "{}")
  const user = JSON.parse(localStorage.getItem('user') || "{}")
  const [projectId, setProjectId] = useState<number | null>(() => {
    const id = localStorage.getItem("projectId")
    return id ? parseInt(id) : null;
  });

  const { showAlert } = useAlert()
  const [projects, setProjects] = useState<Option[]>([])
  const [workflows, setWorkFlows] = useState<Workflow[]>()
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow>()
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskAction, setTaskAction] = useState("")
  const getTaskFormData: Task = {
    title: "",
    description: "",
    projectId: null as number | null,
    statusId: null as number | null,
    priority: "MEDIUM",
    type: "TASK",
    assignedTo: null as number | null,
  }
  const [taskFormData, setTaskFormData] = useState<Task>(getTaskFormData);


  const { permissions: projectPermissions, loading: permissionsLoading } = usePermissions(projectId, "PROJECT");


  const { loading: projectsLoading } = useApiOnLoad<ProjectResponse>(
    {
      endpoint: `/projects/get-my-projects/${org.id}`,
      method: "GET",
    },
    (data) => {
      setProjects(data.projects.map((proj: Project) => ({
        value: Number(proj.id),
        label: proj.name
      })))
    },
    (err) => {
      console.error(err.message)
    }
  )


  const { loading: tasksLoading } = useApiOnLoad<TasksResponse>(
    {
      endpoint: `/tasks/${projectId}`,
      method: "GET",
    },
    (data) => {
      setTasks(data.tasks)
    },
    (err) => {
      console.error(err.message);
    },
  );



  const selectedProject = useMemo(() => {
    if (!projectId || !projects.length) return null;
    return projects.find((p) => p.value === projectId);
  }, [projects, projectId]);

  // console.log({projectId})
  const handleProjectSelect = (option: Option | null) => {
    if (!option) {
      setProjectId(null);
      localStorage.removeItem("projectId");
      return;
    }
    setProjectId(option.value);
    localStorage.setItem("projectId", `${option.value}`);
  };



  const { callApi: fetchWorkflow, loading: fetchingWorkflow } = useApi()

  const getProjectWorkflows = (projectId: number | string) => {
    fetchWorkflow<ProjectWorkflowResponse>(
      {
        endpoint: `/workflow/${projectId}`, // ✅ new endpoint
        method: "GET",
      },
      (data) => {
        setWorkFlows(data.workflows)
      },
      (err) => {
        showAlert({
          type: "error",
          message: err.message,
          showCancel: true,
        })
        console.error(err.message)
      }
    )
  }

  useEffect(() => {
    if (!selectedProject?.value) return;

    getProjectWorkflows(selectedProject?.value);
  }, [selectedProject]);




  const { callApi: fetchDeleteWorkflow, loading: deletingWorkflow } = useApi()

  const deleteWorkflows = (workflow: Workflow) => {
    fetchDeleteWorkflow<ProjectWorkflowResponse>(
      {
        endpoint: `/workflow/${selectedProject?.value}/${workflow.id}`, // ✅ new endpoint
        method: "DELETE",
      },
      (data) => {
        showAlert({
          type: "success",
          message: "Work flow deleted successfully",
          showCancel: true,
        })
        setWorkFlows((prev) => prev?.filter((step) => step.id !== workflow.id));
      },
      (err) => {
        showAlert({
          type: "error",
          message: err.message,
          showCancel: true,
        })
        console.error(err.message)
      }
    )
  }


  const handleDeleteWorkflow = async (workflow: Workflow) => {
    showAlert({
      type: "warning",
      message: `Are you sure you want to delete ${workflow.name} workflow`,
      showCancel: true,
      onOk: () => {
        deleteWorkflows(workflow)
      }
    })
  }



  const { callApi: fetchCreateTask, loading: creatingTask } = useApi();

  const createTask = (payload: Task) => {
    fetchCreateTask<CreateTasksResponse>(
      {
        endpoint: `/tasks/create`,
        method: "POST",
        body: payload,
      },
      (data) => {
        setShowPopup(false)
        showAlert({
          type: "success",
          message: "Task created successfully",
          showCancel: true,
        });
        setTasks((prev: Task[]) => [...prev, data.task]);
        setTaskFormData(getTaskFormData)

      },
      (err) => {
        showAlert({
          type: "error",
          message: err.message,
          showCancel: true,
        });
        console.error(err.message);
      }
    );
  };



  const { callApi: fetchUpdateTask, loading: updatingTask } = useApi();

  const updateTask = (taskId: number | null, payload: Task) => {
    fetchUpdateTask<CreateTasksResponse>(
      {
        endpoint: `/tasks/update/${taskId}`,
        method: "PUT",
        body: payload,
      },
      (data) => {
        setShowPopup(false)
        setTasks((prev: Task[]) =>
          prev.map((task: Task) =>
            task.id === taskId ? { ...task, ...data.task } : task
          )
        );
        setTaskFormData(getTaskFormData)
        showAlert({
          type: "success",
          message: "Task updated successfully",
          showCancel: true,
        });

      },
      (err) => {
        showAlert({
          type: "error",
          message: err.message,
          showCancel: true,
        });
        console.error(err.message);
      }
    );
  };



  const { callApi: fetchDeleteTask, loading: deletingTask } = useApi();

  const deleteTask = (taskId: number) => {
    fetchDeleteTask<Task>(
      {
        endpoint: `/tasks/delete/${taskId}`,
        method: "DELETE",
      },
      () => {
        showAlert({
          type: "success",
          message: "Task deleted successfully",
          showCancel: true,
        });

        setTasks((prev: Task[]) =>
          prev.filter((task: Task) => task.id !== taskId)
        );
      },
      (err) => {
        showAlert({
          type: "error",
          message: err.message,
          showCancel: true,
        });
        console.error(err.message);
      }
    );
  };


  const handleTaskAction = () => {
    const payload = {
      ...(taskAction === "Edit" && { id: taskFormData.id }),
      title: taskFormData.title,
      description: taskFormData.description,
      projectId: selectedProject
        ? Number(selectedProject.value)
        : null,
      statusId: currentWorkflow?.id,
      priority: taskFormData.priority,
      type: taskFormData.type,
      assignedTo: taskFormData.assignedTo ? taskFormData.assignedTo : user?.id,
    }

    if (taskAction === "Create")
      createTask(payload)
    else if (taskFormData.id && taskAction === "Edit")
      updateTask(taskFormData.id, payload)
  }




  const handleEditTask = (task: Task, workflow: Workflow) => {
    setCurrentWorkflow(workflow)
    setTaskFormData({ ...task })
    setShowPopup(true)
    setTaskAction("Edit")
  }



  const handleDeleteTask = (task: Task) => {
    showAlert({
      type: "warning",
      message: (<>
        Are you sure you want to delete <strong> {task.title} </strong>
      </>),
      showCancel: true,
      onOk: () => task.id && deleteTask(task.id)
    });
  }










  const loading = fetchingWorkflow || permissionsLoading || projectsLoading || deletingWorkflow || creatingTask || tasksLoading || updatingTask || deletingTask

  return (
    <div className="container-fluid position-relative">
      <Loader loading={loading} />
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>Workspace Dashboard</h5>
        <div className="w-25 font-size-13">
          <Select
            options={projects}
            value={selectedProject}
            onChange={handleProjectSelect}
            placeholder="Select a project..."
            isSearchable
          />
        </div>
      </div>

      {projectPermissions?.includes("CREATE_WORKFLOW") && (
        <div className="row mt-3 d-flex justify-content-end">
          <button className="btn btn-sm btn-primary" style={{ width: "fit-content" }} type="button" onClick={() => navigate(`/manage-workflow/${selectedProject?.value}`, {
            state: {
              workflows: workflows
            }
          })}>
            Manage WorkFlows
          </button>
        </div>
      )}


      {/* map workflows here  */}

      <div className="mt-3" style={{ display: "flex", gap: "16px" }}>
        {workflows?.map((step) => {
          const stepTasks = tasks?.filter(
            (task) => task?.statusId === step.id
          );

          return (
            <div
              key={step.id}
              style={{
                width: "300px",
                minHeight: "200px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                background: "#f9f9f9",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="d-flex gap-2">
                  <div className="fw-semibold bg-primary p-2 rounded-5 text-white font-size-1" style={{height:"fit-content"}}>
                    {step?.position}{" "}
                  </div>
                  <div className="fw-semibold fs-6">
                    {step.name}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <OptionsMenu
                    options={[
                      {
                        label: "+ Create Task",
                        onClick: () => {
                          setShowPopup(true);
                          setCurrentWorkflow(step);
                          setTaskAction("Create")
                        },
                      },
                    ]}
                  />
                  
                </div>
              </div>

              {/* Tasks OR Empty */}
              <div style={{ marginTop: "20px" }}>
                {stepTasks && stepTasks.length > 0 ? (
                  stepTasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        padding: "8px",
                        marginBottom: "8px",
                        background: "#fff",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                      }}
                    >
                      <div className="d-flex justify-content-between">
                        <div className="fw-semibold fs-6">{task.title}</div>
                        <div className="d-flex gap-2">
                          <Edit2
                            size={13}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleEditTask(task, step)}
                          />
                          <Trash2
                            size={13}
                            style={{ cursor: "pointer", color: "red" }}
                            onClick={() => handleDeleteTask(task)}
                          />
                        </div>
                      </div>
                      <div style={{ fontSize: "12px", color: "#777" }}>
                        {task.priority}
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "10px",
                      border: "1px dashed #aaa",
                      borderRadius: "6px",
                      textAlign: "center",
                      color: "#777",
                    }}
                  >
                    No tasks yet
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>


      <Popup
        show={showPopup}
        title={`${taskAction} Task in ${currentWorkflow?.name}`}
        onClose={() => setShowPopup(false)}
        size='lg'
        buttons={
          [
            { label: "Cancel", onClick: () => setShowPopup(false), className: "btn btn-sm btn-secondary" },
            { label: `${taskAction} Task`, onClick: () => handleTaskAction(), className: "btn btn-sm btn-primary" }
          ]
        }
      >
        <div>
          <CreateTaskForm
            projectPermissions={projectPermissions}
            selectedProject={selectedProject ?? null}
            currentWorkflow={currentWorkflow ?? null}
            formData={taskFormData}
            setFormData={setTaskFormData}
          />
        </div>
      </Popup>
    </div>
  )
}