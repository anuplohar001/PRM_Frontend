import React from "react";

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

const getAlertClass = (type: AlertType) => {
    switch (type) {
        case "success":
            return "alert alert-success";
        case "error":
            return "alert alert-danger";
        case "warning":
            return "alert alert-warning";
        case "confirm":
            return "alert alert-primary";
        default:
            return "alert alert-secondary";
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
                    <div className={`modal-header ${getHeaderClass(type)}`}>
                        <h5 className="modal-title text-capitalize">
                            {type}
                        </h5>
                    </div>

                    {/* ✅ Body */}
                    <div className="modal-body">
                        <p className="mb-0">{message}</p>
                    </div>

                    {/* ✅ Footer */}
                    <div className="modal-footer">
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