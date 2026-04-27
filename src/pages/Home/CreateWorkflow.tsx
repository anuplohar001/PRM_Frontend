import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";
import { useApi } from "../../utils/useApi";
import { useAlert } from "../../components/CustomAlert/AlertContext";
import type { Workflow } from "../../utils/types";
import TextInput from "../../components/CustomTextInput/CustomTextInput";

type FormData = {
    name: string;
    description: string;
    position: number | null;
};

type Props = {
    workflow?: Workflow;
    workflows: Workflow[];
    projectId: number;
    onSuccess: () => void;
};

const CreateWorkflow = ({ workflow, workflows, projectId, onSuccess }: Props) => {
    const isEdit = !!workflow?.id;

    const [formData, setFormData] = useState<FormData>({
        name: "",
        description: "",
        position: null,
    });

    const { showAlert } = useAlert();

    useEffect(() => {
        if (workflow) {
            setFormData({
                name: workflow.name,
                description: workflow.description,
                position: workflow.position,
            });
        }
    }, [workflow]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "position" ? (value === "" ? null : Number(value)) : value,
        }));
    };




    const oldPosition = workflows.find(
        (wf) => wf.id === workflow?.id
    )?.position;

    const newPosition = formData.position;

    const conflicts = workflows.filter(
        (wf) => wf.position === newPosition && wf.id !== workflow?.id
    );

    const conflictNames = conflicts.map((wf) => wf.name).join(", ");

    const affectedWorkflows = workflows.filter((wf) => {
        if (wf.id === workflow?.id) return false;
        if (!newPosition || !oldPosition || !wf.position) return false;

        if (newPosition < oldPosition) {
            return wf.position >= newPosition && wf.position < oldPosition;
        }

        if (newPosition > oldPosition) {
            return wf.position > oldPosition && wf.position <= newPosition;
        }

        return false;
    });

    const affectedNames = affectedWorkflows
        .map((wf) => wf.name)
        .join(", ");



        
    const { callApi: createWorkflow, loading } = useApi();
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();


        if (!formData.name || !formData.position) {
            showAlert({
                message: "Please fill all fields",
            });
            return;
        }

        const submitApi = () => {

            createWorkflow<Workflow>(
                {
                    endpoint: isEdit ? "/workflow/update" : "/workflow/create",
                    method: isEdit ? "PUT" : "POST",
                    body: {
                        ...(isEdit && { id: workflow?.id }),
                        name: formData.name,
                        position: formData.position,
                        description: formData.description,
                        projectId,
                    },
                },
                () => {
                    onSuccess();
                },
                (err) => {
                    console.error(err.message);
                }
            );
        };

        if (conflicts.length > 0) {
            showAlert({
                message: (
                    <>
                        Position already taken by:{" "}
                        <strong>{conflictNames}</strong>.
                        <br />
                        These workflows will be reordered:{" "}
                        <strong>{formData.name}</strong>,{" "}
                        <strong>{affectedNames}</strong>.
                        <br />
                        Continue?
                    </>
                ),
                showCancel: true,
                onCancel: () => { },
                onOk: submitApi,
            });
            return;
        }

        submitApi();
    };
    

    return (
        <div>
            <Loader loading={loading} />

            <form id="workflow-form" onSubmit={handleSubmit}>

                <TextInput
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter workflow name"
                    required
                />

                <TextInput
                    label="Position"
                    name="position"
                    type="number"
                    value={formData.position ? formData.position : ""}
                    onChange={handleChange}
                    placeholder="Enter position"
                    required
                />

                <TextInput
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                    required
                />

            </form>
        </div>
    );
};

export default CreateWorkflow;