import React, { createContext, useContext, useState } from "react";
import CustomAlert from "./CustomAlert";

type AlertType = "success" | "error" | "warning" | "confirm";

interface AlertOptions {
    type?: AlertType;
    message: string;
    showCancel?: boolean;
    onOk?: () => void;
    onCancel?: () => void;
}

interface AlertState extends AlertOptions {
    show: boolean;
}

interface AlertContextType {
    showAlert: (options: AlertOptions) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [alert, setAlert] = useState<AlertState>({
        show: false,
        type: "success",
        message: "",
        showCancel: false,
    });

    const showAlert = (options: AlertOptions) => {
        setAlert({
            show: true,
            type: options.type || "success",
            message: options.message,
            showCancel: options.showCancel || false,
            onOk: options.onOk,
            onCancel: options.onCancel,
        });
    };

    const closeAlert = () => {
        setAlert((prev) => ({ ...prev, show: false }));
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}

            <CustomAlert
                {...alert}
                onOk={() => {
                    alert.onOk?.();
                    closeAlert();
                }}
                onCancel={() => {
                    alert.onCancel?.();
                    closeAlert();
                }}
            />
        </AlertContext.Provider>
    );
};

export const useAlert = (): AlertContextType => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within AlertProvider");
    }
    return context;
};