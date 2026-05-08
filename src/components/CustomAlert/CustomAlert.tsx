import React from "react";
import { CheckCircle, XCircle, AlertTriangle, Info } from "react-feather";

type AlertType = "success" | "error" | "warning" | "confirm";

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
            return "btn btn-success btn-sm";
        case "error":
            return "btn btn-danger btn-sm";
        case "warning":
            return "btn btn-warning btn-sm";
        case "confirm":
            return "btn btn-primary btn-sm";
        default:
            return "btn btn-dark btn-sm";
    }
};

const getHeaderClass = (type: AlertType) => {
    switch (type) {
        case "success":
            return "bg-success text-white";
        case "error":
            return "bg-danger text-white";
        case "warning":
            return "bg-warning text-dark";
        case "confirm":
            return "bg-primary text-white"
        default:
            return "bg-secondary text-white";
    }
};
const getMessageClass = (type: AlertType) => {
    switch (type) {
        case "success":
            return "text-success";
        case "error":
            return "text-danger";
        case "warning":
            return "text-muted";
        case "confirm":
            return "text-primary";
        default:
            return "text-secondary";
    }
};

const getAlertIcon = (type: AlertType) => {
    switch (type) {
        case "success":
            return <CheckCircle size={24} className="text-white" />;
        case "error":
            return <XCircle size={24} className="text-white" />;
        case "warning":
            return <AlertTriangle size={24} className="text-white" />;
        case "confirm":
            return <Info size={24} className="text-white" />;
        default:
            return <Info size={24} className="text-white" />;
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
        <div
            className="modal fade show"
            style={{
                display: "block",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1060,
            }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                    {/* ✅ Header */}
                    <div className={`modal-header p-2 ${getHeaderClass(type)}`}>
                        <h5 className="text-capitalize d-flex gap-2">
                          {getAlertIcon(type)}  {type}
                        </h5>
                    </div>

                    {/* ✅ Body */}
                    <div className="modal-body text-center">
                        <p className={`mb-0 fw-semibold ${getMessageClass(type)}`}>{message}</p>
                    </div>

                    {/* ✅ Footer */}
                    <div className="modal-footer justify-content-center">
                        {showCancel && (
                            <button
                                className="btn btn-secondary btn-sm"
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