import React, { useState } from 'react'
import Loader from '../../components/Loader/Loader'
import Select from 'react-select/base'
import { useNavigate, useParams } from 'react-router-dom'
import { useApiOnLoad } from '../../utils/useApiOnLoad'
import type { Workflow } from '../../utils/types'
import { useAlert } from '../../components/CustomAlert/AlertContext'
import { Edit2, Trash2 } from 'react-feather'
import usePermissions from '../../utils/usePermissions'
import { useApi } from '../../utils/useApi'
import OptionsMenu from '../../components/CustomDialogBox/OptionsMenu'
import Popup from '../../components/PopupModal/PopupModal'
import CreateWorkflow from './CreateWorkflow'


type ProjectWorkflowResponse = {
  workflows: Workflow[]
}
const ManageWorkflow = () => {

    const { id } = useParams()
    const projectId = id ? parseInt(id) : null
    const navigate = useNavigate()
    const {showAlert} = useAlert()
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const [currentWorkflow, setCurrentWorkflow] = useState<Workflow>()
    const [workflows, setWorkflows] = useState<Workflow[]>([])
    const { permissions: projectPermissions, loading: permissionsLoading } = usePermissions(projectId, "PROJECT");
    const { loading: workflowsLoading } = useApiOnLoad<ProjectWorkflowResponse>(
        {
            endpoint: `/workflow/${projectId}`, // ✅ new endpoint
            method: "GET",
        },
        (data) => {
            setWorkflows(data.workflows)
        },
        (err) => {
            showAlert({
                type: "error",
                message: err.message,
                showCancel: true,
            })
            console.error(err.message)
        }
      );


    const { callApi: fetchDeleteWorkflow, loading: deletingWorkflow } = useApi()
    
      const deleteWorkflows = (workflow: Workflow) => {
        fetchDeleteWorkflow<ProjectWorkflowResponse>(
          {
            endpoint: `/workflow/${projectId}/${workflow.id}`, // ✅ new endpoint
            method: "DELETE",
          },
          (data) => {
            showAlert({
              type: "success",
              message: "Work flow deleted successfully",
              showCancel: true,
            })
            setWorkflows((prev) => prev?.filter((step) => step.id !== workflow.id));
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


      

    const loading = workflowsLoading || permissionsLoading || deletingWorkflow
    return (
        <div>
            <Loader loading={loading} />
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>Manage Workflows</h5>

                <div className='d-flex gap-2'>
                    <button className="btn btn-sm btn-primary" style={{ width: "fit-content" }} type="button" onClick={() => {
                        setCurrentWorkflow(undefined)
                        setShowPopup(true)
                    }}>
                        Create WorkFlow
                    </button>

                    <button className="btn btn-sm btn-secondary" style={{ width: "fit-content" }} type="button" onClick={() => navigate(`/`)}>
                        Back
                    </button>
                </div>
            </div>




            <div className="mt-3" style={{ display: "flex", gap: "40px", flexWrap:"wrap" }}>
                {workflows?.map((step) => {

                    return (
                        <div
                            key={step.id}
                            style={{
                                width: "200px",
                                minHeight: "50px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "10px",
                                background: "#f9f9f9",
                                cursor:"move"
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
                                    <div className="fw-semibold bg-primary p-2 rounded-5 text-white font-size-1" style={{ height: "fit-content" }}>
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
                                                label: "✏️ Update workflow",
                                                onClick: () => {
                                                    setShowPopup(true);
                                                    setCurrentWorkflow(step);
                                                },
                                            },
                                            {
                                                label: "❌ Delete",
                                                onClick : () => handleDeleteWorkflow(step),
                                                danger: true,
                                            },
                                        ]}
                                    />
                                    
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>


            <Popup
                show={showPopup}
                title={currentWorkflow ? `Update ${currentWorkflow.name}` : "Create Workflow"}
                onClose={() => setShowPopup(false)}
                size="lg"
                buttons={[
                    {
                        label: "Cancel",
                        onClick: () => setShowPopup(false),
                        className: "btn btn-sm btn-secondary",
                    },
                    {
                        label: "Save",
                        type: "submit",            // ✅ important
                        form: "workflow-form",     // ✅ connects to form
                        className: "btn btn-sm btn-primary",
                    }
                ]}
            >
                <CreateWorkflow
                    workflow={currentWorkflow}
                    workflows={workflows}
                    projectId={projectId!}
                    onSuccess={() => {
                        setShowPopup(false);
                    }}
                />
            </Popup>
        </div>
    )
}

export default ManageWorkflow
