import React, { useEffect, useState } from "react"
import "@/styles/recent-activities.css"
import {
    Activity,
    CheckCircle,
    UserPlus,
    Folder,
    MessageCircle,
    Edit,
    Trash2,
    Coffee,
    User,
    Users,
    PenTool
} from "react-feather"
import { useApi } from "@/utils/useApi"

type ActivityType =
    | "USER_CREATED"
    | "TEAM_CREATED"
    | "TASK_CREATED"
    | "TASK_DELETED"
    | "TASK_UPDATED"
    | "TASK_COMPLETED"
    | "USER_ADDED"
    | "PROJECT_CREATED"
    | "COMMENT_ADDED"

type ActivityItem = {
    id: string
    type: ActivityType
    message: string
    user: string
    time: string
}

const getIcon = (type: ActivityType) => {
    switch (type) {
        case "USER_CREATED":
            return <UserPlus size={16} className="text-primary" />
        case "TEAM_CREATED":
            return <Users size={16} className="text-primary" />
        case "TASK_CREATED":
            return <PenTool size={16} className="text-primary" />

        case "TASK_UPDATED":
            return <Edit size={16} className="text-primary" />

        case "TASK_DELETED":
            return <Trash2 size={16} className="text-danger" />

        case "TASK_COMPLETED":
            return <CheckCircle size={16} className="text-success" />

        case "USER_ADDED":
            return <UserPlus size={16} />

        case "PROJECT_CREATED":
            return <Folder size={16} />

        case "COMMENT_ADDED":
            return <MessageCircle size={16} />

        default:
            return <Activity size={16} />
    }
};

const RecentActivities: React.FC = () => {

    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const userId = user?.id
    const [activities, setActivities] = useState<ActivityItem[]>([])
    const { callApi, loading } = useApi()



    // 🕒 Time formatter
    const timeAgo = (date: string) => {
        const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)

        if (diff < 60) return `${diff}s ago`
        if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
        if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
        return `${Math.floor(diff / 86400)} days ago`
    }



    const mapActivity = (activity: any): ActivityItem => {
        let type: ActivityType = "TASK_CREATED"
        let message = ""

        switch (activity.action) {
            case "CREATE_USER":
                type = "USER_CREATED"
                message = `created user "${activity.metadata?.title || ""}" under "${activity.metadata?.subTitle || ""}"`
                break

            case "CREATE_TEAM":
                type = "TEAM_CREATED"
                message = `created team "${activity.metadata?.title || ""}" under "${activity.metadata?.projectTitle || ""}"`
                break

            case "CREATE_TASK":
                type = "TASK_CREATED"
                message = `created task "${activity.metadata?.title || ""}" under "${activity.metadata?.projectTitle || ""}"`
                break

            case "ASSIGN_TASK":
                type = "TASK_CREATED"
                message = `assigned task "${activity.metadata?.title || ""}" under "${activity.metadata?.projectTitle || ""}"`
                break

            case "UPDATE_TASK":
                type = "TASK_COMPLETED"
                message = `updated task "${activity.metadata?.title || ""}"`
                break

            case "DELETE_TASK":
                type = "TASK_DELETED"
                message = `deleted task "${activity.metadata?.title || ""}" under "${activity.metadata?.projectTitle || ""}"`
                break

            default:
                message = "did something"
        }

        return {
            id: String(activity.id),
            type,
            message,
            user: activity.actorId===userId ? "You" :  activity.actor?.name || "User",
            time: timeAgo(activity.createdAt),
        }
    }
   
    const fetchActivities = () => {
        callApi(
            {
                endpoint: "/activities/",
                method: "GET",
            },
            (data) => {
                const formatted = data.activities.map((item: any) =>
                    mapActivity(item)
                )
                setActivities(formatted)
            },
            (err) => {
                console.error(err.message)
            }
        )
    }

    useEffect(() => {
        fetchActivities()
    }, [])


    // 🔥 Transform backend → UI
    

    

    return (
        <div className="d-flex flex-column" style={{ maxHeight: "80vh" }}>
            {/* Header */}
            <div className="p-3 border-bottom">
                <h5 className="mb-0">Recent Activities</h5>
            </div>

            {/* Content */}
            <div className="flex-grow-1 overflow-auto p-3">
                <div className="timeline position-relative ms-3">

                    {loading && <div>Loading...</div>}

                    {!loading && activities.length === 0 && (
                        <div className="text-muted">No activities found</div>
                    )}

                    {activities.map((activity) => (
                        <div key={activity.id} className="mb-4 position-relative">

                            <div className="timeline-icon">
                                {getIcon(activity.type)}
                            </div>

                            <div className="card shadow-sm ms-4">
                                <div className="card-body py-2 px-3">
                                    <div className="small">
                                        <strong>{activity.user}</strong> {activity.message}
                                    </div>
                                    <div className="text-muted small">
                                        {activity.time}
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RecentActivities