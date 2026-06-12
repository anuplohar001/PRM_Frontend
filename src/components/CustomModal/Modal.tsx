// components/common/Modal.tsx

import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
    open: boolean;
    showCloseBtn?: boolean;
    showCornerBtn?: boolean;
    onClose: () => void;
    title: string;
    icon?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    maxWidth?: string;
    height?: string;
    cornerBtnConfig: {
        label: string,
        onClick: () => void
    }
}

const Modal = ({
    open,
    onClose,
    showCloseBtn = true,
    showCornerBtn = false,
    cornerBtnConfig = {
        label: "",
        onClick: () => { }
    },
    title,
    icon,
    children,
    footer,
    maxWidth = "max-w-3xl",
    height = "h-[90vh]",
}: ModalProps) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs">
            <div className="flex h-full w-full items-center justify-center p-4">
                <div
                    className={`relative flex w-full ${maxWidth} ${height} flex-col overflow-hidden rounded-md border border-neutral-800 bg-[#111111]`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                        <div className="flex items-center gap-2.5">
                            {icon && (
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900">
                                    {icon}
                                </div>
                            )}

                            <span className="text-sm font-medium text-neutral-200">
                                {title}
                            </span>
                        </div>

                        {showCloseBtn && (
                            <button
                                onClick={onClose}
                                className="text-neutral-500 transition hover:text-white"
                            >
                                <X size={15} />
                            </button>
                        )}

                        {showCornerBtn && (
                            <button className="rounded-mg bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-700"
                                onClick={cornerBtnConfig.onClick}
                            >
                                {cornerBtnConfig.label}
                            </button>
                        )}
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto">
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <div className="border-t border-neutral-800 px-6 py-4">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;