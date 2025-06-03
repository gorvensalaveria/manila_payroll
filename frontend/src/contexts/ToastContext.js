"use client";

import { createContext, useContext, useRef } from "react";
import { Toast } from "primereact/toast";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const toast = useRef(null);

  const showSuccess = (message, detail = "") => {
    toast.current?.show({
      severity: "success",
      summary: message,
      detail: detail,
      life: 3000,
    });
  };

  const showError = (message, detail = "") => {
    toast.current?.show({
      severity: "error",
      summary: message,
      detail: detail,
      life: 5000,
    });
  };

  const showWarn = (message, detail = "") => {
    toast.current?.show({
      severity: "warn",
      summary: message,
      detail: detail,
      life: 4000,
    });
  };

  const showInfo = (message, detail = "") => {
    toast.current?.show({
      severity: "info",
      summary: message,
      detail: detail,
      life: 3000,
    });
  };

  const value = {
    showSuccess,
    showError,
    showWarn,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast ref={toast} position="top-right" />
    </ToastContext.Provider>
  );
};
