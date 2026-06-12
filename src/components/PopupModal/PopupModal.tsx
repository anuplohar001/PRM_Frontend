import React from "react";

type ButtonConfig = {
    label: string;
    type?: "button" | "submit" | "reset" | undefined ;
    form?:string;
    onClick?: () => void;
    className?: string;
};

type PopupProps = {
    show: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    buttons?: ButtonConfig[];
    size?: "sm" | "md" | "lg";
};

export default function Popup({
    show,
    title,
    onClose,
    children,
    buttons = [],
    size = "md",
}: PopupProps) {
    if (!show) return null;

    return (
        <div
            className="modal fade show d-block"
            style={{ background: "rgba(0,0,0,0.5)" }}
        >
            <div className={`modal-dialog modal-${size}`}>
                <div className="modal-content">

                    {/* Header */}
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>

                    {/* Body */}
                    <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>{children}</div>

                    {/* Footer */}
                    {buttons.length > 0 && (
                        <div className="modal-footer justify-content-end">
                            {buttons.map((btn, index) => (
                                <button
                                    key={index}
                                    className={btn.className || "btn btn-primary"}
                                    onClick={btn.onClick}
                                    type={btn.type || "button"}
                                    form={btn.form}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}