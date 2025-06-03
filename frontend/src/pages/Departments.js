"use client";

import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { departmentAPI } from "../services/api";
import { useToast } from "../contexts/ToastContext";
import { format } from "date-fns";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const dt = useRef(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentAPI.getAll();
      setDepartments(response.data.data);
    } catch (error) {
      showError("Error", "Failed to fetch departments");
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setFormData({
      name: "",
      description: "",
    });
    setFormErrors({});
    setSelectedDepartment(null);
    setDialogVisible(true);
  };

  const editDepartment = (department) => {
    setFormData({
      name: department.name,
      description: department.description || "",
    });
    setFormErrors({});
    setSelectedDepartment(department);
    setDialogVisible(true);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Department name is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveDepartment = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const departmentData = {
        name: formData.name,
        description: formData.description,
      };

      if (selectedDepartment) {
        await departmentAPI.update(selectedDepartment.id, departmentData);
        showSuccess("Success", "Department updated successfully");
      } else {
        await departmentAPI.create(departmentData);
        showSuccess("Success", "Department created successfully");
      }

      setDialogVisible(false);
      fetchDepartments();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to save department";
      showError("Error", errorMessage);
      console.error("Error saving department:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteDepartment = (department) => {
    confirmDialog({
      message: `Are you sure you want to delete the ${department.name} department?`,
      header: "Confirm Delete",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          await departmentAPI.delete(department.id);
          showSuccess("Success", "Department deleted successfully");
          fetchDepartments();
        } catch (error) {
          const errorMessage =
            error.response?.data?.error || "Failed to delete department";
          showError("Error", errorMessage);
          console.error("Error deleting department:", error);
        }
      },
    });
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  // Template functions for DataTable columns
  const nameBodyTemplate = (rowData) => {
    return (
      <div>
        <div style={{ fontWeight: "600", fontSize: "1rem" }}>
          {rowData.name}
        </div>
        {rowData.description && (
          <div
            style={{
              fontSize: "0.875rem",
              color: "#6c757d",
              marginTop: "0.25rem",
            }}
          >
            {rowData.description}
          </div>
        )}
      </div>
    );
  };

  const employeeCountBodyTemplate = (rowData) => {
    return (
      <div className="text-center">
        <span className="department-chip">
          {rowData.employee_count}{" "}
          {rowData.employee_count === 1 ? "Employee" : "Employees"}
        </span>
      </div>
    );
  };

  const createdDateBodyTemplate = (rowData) => {
    return format(new Date(rowData.created_at), "MMM dd, yyyy");
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-button-text"
          onClick={() => editDepartment(rowData)}
          tooltip="Edit"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-text"
          onClick={() => deleteDepartment(rowData)}
          tooltip="Delete"
          disabled={rowData.employee_count > 0}
        />
      </div>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h2 className="m-0">Departments</h2>
      <div className="flex gap-2 mt-2 md:mt-0">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search departments..."
          />
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Department Management</h1>
        <p className="page-subtitle">Manage your organization's departments</p>
      </div>

      <div className="card-container">
        <div className="action-buttons">
          <Button
            label="New Department"
            icon="pi pi-plus"
            className="p-button-success"
            onClick={openNew}
          />
          <Button
            label="Export"
            icon="pi pi-upload"
            className="p-button-help"
            onClick={exportCSV}
          />
        </div>

        <DataTable
          ref={dt}
          value={departments}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          className="datatable-responsive"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} departments"
          globalFilter={globalFilter}
          header={header}
          responsiveLayout="scroll"
        >
          <Column
            field="name"
            header="Department"
            body={nameBodyTemplate}
            sortable
            style={{ width: "40%" }}
          ></Column>
          <Column
            field="employee_count"
            header="Employees"
            body={employeeCountBodyTemplate}
            sortable
            style={{ width: "20%" }}
          ></Column>
          <Column
            field="created_at"
            header="Created"
            body={createdDateBodyTemplate}
            sortable
            style={{ width: "20%" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            headerStyle={{ width: "20%" }}
          ></Column>
        </DataTable>
      </div>

      {/* Department Dialog */}
      <Dialog
        visible={dialogVisible}
        style={{ width: "500px" }}
        header={selectedDepartment ? "Edit Department" : "New Department"}
        modal
        className="p-fluid"
        onHide={() => setDialogVisible(false)}
      >
        <div className="form-field">
          <label htmlFor="name">Department Name *</label>
          <InputText
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={formErrors.name ? "p-invalid" : ""}
            placeholder="Enter department name"
          />
          {formErrors.name && (
            <small className="p-error">{formErrors.name}</small>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="description">Description</label>
          <InputTextarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            placeholder="Enter department description (optional)"
          />
        </div>

        <div className="form-actions">
          <Button
            label="Cancel"
            icon="pi pi-times"
            className="p-button-text"
            onClick={() => setDialogVisible(false)}
            disabled={submitting}
          />
          <Button
            label={submitting ? "Saving..." : "Save"}
            icon={submitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
            className="p-button-primary"
            onClick={saveDepartment}
            disabled={submitting}
          />
        </div>
      </Dialog>

      <ConfirmDialog />
    </div>
  );
};

export default Departments;
