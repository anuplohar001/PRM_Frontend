import React from "react";
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Info,
} from "lucide-react";

type AlertType =
    | "success"
    | "error"
    | "warning"
    | "confirm";

interface CustomAlertProps {
    type?: AlertType;
    message: React.ReactNode;
    show: boolean;
    showCancel?: boolean;
    onOk?: () => void;
    onCancel?: () => void;
}

const getButtonClass = (type: AlertType) => {
    switch (type) {
        case "success":
            return "rounded-md bg-green-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-green-700";

        case "error":
            return "rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-red-700";

        case "warning":
            return "rounded-md bg-yellow-500 px-4 py-1.5 text-sm font-medium text-black transition hover:bg-yellow-600";

        case "confirm":
            return "rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700";

        default:
            return "rounded-md bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-neutral-800";
    }
};

const getHeaderClass = (type: AlertType) => {
    switch (type) {
        case "success":
            return "bg-green-600 text-white";

        case "error":
            return "bg-red-600 text-white";

        case "warning":
            return "bg-yellow-500 text-black";

        case "confirm":
            return "bg-blue-600 text-white";

        default:
            return "bg-neutral-700 text-white";
    }
};

const getMessageClass = (type: AlertType) => {
    switch (type) {
        case "success":
            return "text-black";

        case "error":
            return "text-black";

        case "warning":
            return "text-black";

        case "confirm":
            return "text-black";

        default:
            return "text-black";
    }
};

const getAlertIcon = (type: AlertType) => {
    switch (type) {
        case "success":
            return (
                <CheckCircle
                    size={22}
                    className="text-white"
                />
            );

        case "error":
            return (
                <XCircle
                    size={22}
                    className="text-white"
                />
            );

        case "warning":
            return (
                <AlertTriangle
                    size={22}
                    className="text-black"
                />
            );

        case "confirm":
            return (
                <Info
                    size={22}
                    className="text-white"
                />
            );

        default:
            return (
                <Info
                    size={22}
                    className="text-white"
                />
            );
    }
};

const CustomAlert: React.FC<CustomAlertProps> = ({
    type = "success",
    message,
    show,
    showCancel = false,
    onOk,
    onCancel,
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[1060] flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md px-4">
                <div className="overflow-hidden rounded-md bg-white shadow-2xl">
                    {/* Header */}
                    <div
                        className={`flex items-center p-3 ${getHeaderClass(
                            type
                        )}`}
                    >
                        <h5 className="flex items-center gap-2 text-base font-semibold capitalize">
                            {getAlertIcon(type)}
                            {type}
                        </h5>
                    </div>

                    {/* Body */}
                    <div className="px-4 py-5 text-center">
                        <p
                            className={`text-sm font-semibold ${getMessageClass(
                                type
                            )}`}
                        >
                            {message}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-center gap-2 border-t border-neutral-200 px-4 py-3">
                        {showCancel && (
                            <button
                                className="rounded-md bg-gray-500 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-gray-600"
                                onClick={onCancel}
                            >
                                Cancel
                            </button>
                        )}

                        <button
                            className={getButtonClass(type)}
                            onClick={onOk}
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomAlert;