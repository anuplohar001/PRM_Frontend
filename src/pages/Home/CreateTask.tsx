import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { Option, Task, Workflow, Member } from "../../utils/types";
import TextInput from "../../components/CustomTextInput/CustomTextInput";
import CustomSelect from "../../components/CustomTextInput/CsutomSelectInput";
import Loader from "../../components/Loader/Loader";
import { Action } from "../../utils/getAllPermissions";
import { useApi } from "../../utils/useApi";


type MembersResponse = {
    members: Member[]
}


type Props = {
    formData: Task
    projectPermissions: string[]
    setFormData: Dispatch<SetStateAction<Task>>
    selectedProject: Option | null;
    currentWorkflow: Workflow | null;
};

const CreateTaskForm: React.FC<Props> = ({
    selectedProject,
    projectPermissions,
    currentWorkflow,
    formData,
    setFormData,
}) => {

    const [members, setMembers] = useState<Option[]>([])
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    const { callApi: fetchMembers, loading: membersLoading } = useApi()

    const getProjectMembers = () => {
        fetchMembers<MembersResponse>(
            {
                endpoint: `/projects/get-members/${selectedProject?.value}`,
                method: "GET",
            },
            (data) => {
                setMembers(data.members.map((mbr: Member) => ({
                    value: Number(mbr.user.id),
                    label: mbr.user.name
                })))
            },
            (err) => {
                console.error(err.message)
            }
        )
    }

    useEffect(() => {
      if(projectPermissions.includes(Action.ASSIGN_TASK))
        getProjectMembers()
      else {
        const self = [
            {value: user?.id, label: user?.name}
        ]
        setMembers(self)
      }
    }, [projectPermissions])
    


    

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const loading = membersLoading
    return (
        <div className="position-relative">
            <Loader loading={loading} />
            <form className="card p-1 border-0 font-size-13">
                {/* <h5 className="mb-3">{taskAction} Task</h5> */}

                {/* Title */}
                <div className="mb-3">
                    <TextInput
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter task title..."
                        required
                    />
                </div>

                {/* Description */}
                <div className="mb-3">
                    <TextInput
                        label="Description"
                        name="description"
                        type="textarea"
                        value={formData?.description}
                        onChange={handleInputChange}
                        placeholder="Enter description..."
                    />
                </div>

                {/* Project */}
                <div className="mb-3">
                    <TextInput
                        label="Project"
                        name="project"
                        value={selectedProject?.label}
                        required
                        disabled
                        onChange={() => { }}
                    />
                </div>

                {/* Status */}
                <div className="mb-3">
                    <TextInput
                        label="Status"
                        name="status"
                        type="text"
                        value={currentWorkflow?.name}
                        disabled
                        onChange={() => { }}
                    />
                </div>

                {/* Assigned To */}
                <div className="mb-3">
                    <CustomSelect
                        label="Assigned to"
                        name="assignedTo"
                        required
                        options={members}
                        value={formData.assignedTo ?? null}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Priority */}
                <div className="mb-3">
                    <CustomSelect
                        label="Select Priority"
                        name="priority"
                        value={formData.priority ?? null}
                        options={[
                            { label: "Low", value: "LOW" },
                            { label: "Medium", value: "MEDIUM" },
                            { label: "High", value: "HIGH" }
                        ]}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                {/* Type */}
                <div className="mb-3">

                    <CustomSelect
                        label="Type"
                        name="type"
                        value={formData.type}
                        options={[
                            { label: "Task", value: "TASK" },
                            { label: "Bug", value: "BUG" },
                            { label: "Feature", value: "FEATURE" },
                            { label: "Improvement", value: "IMPROVEMENT" },
                            { label: "Story", value: "STORY" },
                            { label: "Subtask", value: "SUBTASK" },
                            { label: "Epic", value: "EPIC" },
                        ]}
                        onChange={handleInputChange}
                        required
                    />
                </div>

            </form>
        </div>
    )
}

export default CreateTaskForm;