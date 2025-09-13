"use client";

import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { employeeAPI, departmentAPI } from "../services/api";
import { useToast } from "../contexts/ToastContext";
import { format } from "date-fns";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    departmentId: null,
    position: "",
    salary: null,
    hireDate: null,
    status: "active",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const dt = useRef(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, [fetchEmployees, fetchDepartments]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      setEmployees(response.data.data);
    } catch (error) {
      showError("Error", "Failed to fetch employees");
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getAll();
      setDepartments(response.data.data);
    } catch (error) {
      showError("Error", "Failed to fetch departments");
      console.error("Error fetching departments:", error);
    }
  };

  const openNew = () => {
    setFormData({
      employeeId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      departmentId: null,
      position: "",
      salary: null,
      hireDate: null,
      status: "active",
    });
    setFormErrors({});
    setSelectedEmployee(null);
    setDialogVisible(true);
  };

  const editEmployee = (employee) => {
    setFormData({
      employeeId: employee.employee_id,
      firstName: employee.first_name,
      lastName: employee.last_name,
      email: employee.email,
      phone: employee.phone || "",
      departmentId: employee.department_id,
      position: employee.position,
      salary: employee.salary,
      hireDate: new Date(employee.hire_date),
      status: employee.status,
    });
    setFormErrors({});
    setSelectedEmployee(employee);
    setDialogVisible(true);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.employeeId.trim())
      errors.employeeId = "Employee ID is required";
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";
    if (!formData.position.trim()) errors.position = "Position is required";
    if (!formData.salary || formData.salary <= 0)
      errors.salary = "Valid salary is required";
    if (!formData.hireDate) errors.hireDate = "Hire date is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveEmployee = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const employeeData = {
        employeeId: formData.employeeId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        departmentId: formData.departmentId,
        position: formData.position,
        salary: formData.salary,
        hireDate: format(formData.hireDate, "yyyy-MM-dd"),
        status: formData.status,
      };

      if (selectedEmployee) {
        await employeeAPI.update(selectedEmployee.id, employeeData);
        showSuccess("Success", "Employee updated successfully");
      } else {
        await employeeAPI.create(employeeData);
        showSuccess("Success", "Employee created successfully");
      }

      setDialogVisible(false);
      fetchEmployees();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to save employee";
      showError("Error", errorMessage);
      console.error("Error saving employee:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEmployee = (employee) => {
    confirmDialog({
      message: `Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`,
      header: "Confirm Delete",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          await employeeAPI.delete(employee.id);
          showSuccess("Success", "Employee deleted successfully");
          fetchEmployees();
        } catch (error) {
          const errorMessage =
            error.response?.data?.error || "Failed to delete employee";
          showError("Error", errorMessage);
          console.error("Error deleting employee:", error);
        }
      },
    });
  };

  const deleteSelectedEmployees = () => {
    confirmDialog({
      message: `Are you sure you want to delete ${selectedEmployees.length} selected employees?`,
      header: "Confirm Delete",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          const ids = selectedEmployees.map((emp) => emp.id);
          await employeeAPI.deleteMultiple(ids);
          showSuccess(
            "Success",
            `${selectedEmployees.length} employees deleted successfully`
          );
          setSelectedEmployees([]);
          fetchEmployees();
        } catch (error) {
          const errorMessage =
            error.response?.data?.error || "Failed to delete employees";
          showError("Error", errorMessage);
          console.error("Error deleting employees:", error);
        }
      },
    });
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  // Template functions for DataTable columns
  const avatarBodyTemplate = (rowData) => {
    return (
      <div className="employee-avatar">
        {rowData.first_name.charAt(0)}
        {rowData.last_name.charAt(0)}
      </div>
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <div>
        <div style={{ fontWeight: "600" }}>
          {rowData.first_name} {rowData.last_name}
        </div>
        <div style={{ fontSize: "0.875rem", color: "#6c757d" }}>
          {rowData.employee_id}
        </div>
      </div>
    );
  };

  const departmentBodyTemplate = (rowData) => {
    return (
      <span className="department-chip">
        {rowData.department_name || "No Department"}
      </span>
    );
  };

  const salaryBodyTemplate = (rowData) => {
    return (
      <span className="salary-amount">₱{rowData.salary?.toLocaleString()}</span>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <span className={`status-badge status-${rowData.status}`}>
        {rowData.status}
      </span>
    );
  };

  const hireDateBodyTemplate = (rowData) => {
    return format(new Date(rowData.hire_date), "MMM dd, yyyy");
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-button-text"
          onClick={() => editEmployee(rowData)}
          tooltip="Edit"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-text"
          onClick={() => deleteEmployee(rowData)}
          tooltip="Delete"
        />
      </div>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h2 className="m-0">Employees</h2>
      <div className="flex gap-2 mt-2 md:mt-0">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search employees..."
          />
        </span>
      </div>
    </div>
  );

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const departmentOptions = departments.map((dept) => ({
    label: dept.name,
    value: dept.id,
  }));

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
        <h1 className="page-title">Employee Management</h1>
        <p className="page-subtitle">Manage your organization's employees</p>
      </div>

      <div className="card-container">
        <div className="action-buttons">
          <Button
            label="New Employee"
            icon="pi pi-plus"
            className="p-button-success"
            onClick={openNew}
          />
          <Button
            label="Delete Selected"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={deleteSelectedEmployees}
            disabled={!selectedEmployees || selectedEmployees.length === 0}
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
          value={employees}
          selection={selectedEmployees}
          onSelectionChange={(e) => setSelectedEmployees(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          className="datatable-responsive"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
          globalFilter={globalFilter}
          header={header}
          responsiveLayout="scroll"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          <Column
            body={avatarBodyTemplate}
            headerStyle={{ width: "4rem" }}
          ></Column>
          <Column
            field="name"
            header="Name"
            body={nameBodyTemplate}
            sortable
          ></Column>
          <Column field="email" header="Email" sortable></Column>
          <Column field="phone" header="Phone"></Column>
          <Column
            field="department_name"
            header="Department"
            body={departmentBodyTemplate}
            sortable
          ></Column>
          <Column field="position" header="Position" sortable></Column>
          <Column
            field="salary"
            header="Salary"
            body={salaryBodyTemplate}
            sortable
          ></Column>
          <Column
            field="hire_date"
            header="Hire Date"
            body={hireDateBodyTemplate}
            sortable
          ></Column>
          <Column
            field="status"
            header="Status"
            body={statusBodyTemplate}
            sortable
          ></Column>
          <Column
            body={actionBodyTemplate}
            headerStyle={{ width: "8rem" }}
          ></Column>
        </DataTable>
      </div>

      {/* Employee Dialog */}
      <Dialog
        visible={dialogVisible}
        style={{ width: "600px" }}
        header={selectedEmployee ? "Edit Employee" : "New Employee"}
        modal
        className="p-fluid"
        onHide={() => setDialogVisible(false)}
      >
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="employeeId">Employee ID *</label>
            <InputText
              id="employeeId"
              value={formData.employeeId}
              onChange={(e) =>
                setFormData({ ...formData, employeeId: e.target.value })
              }
              className={formErrors.employeeId ? "p-invalid" : ""}
            />
            {formErrors.employeeId && (
              <small className="p-error">{formErrors.employeeId}</small>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="firstName">First Name *</label>
            <InputText
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className={formErrors.firstName ? "p-invalid" : ""}
            />
            {formErrors.firstName && (
              <small className="p-error">{formErrors.firstName}</small>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="lastName">Last Name *</label>
            <InputText
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className={formErrors.lastName ? "p-invalid" : ""}
            />
            {formErrors.lastName && (
              <small className="p-error">{formErrors.lastName}</small>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="email">Email *</label>
            <InputText
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={formErrors.email ? "p-invalid" : ""}
            />
            {formErrors.email && (
              <small className="p-error">{formErrors.email}</small>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="phone">Phone</label>
            <InputText
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="form-field">
            <label htmlFor="department">Department</label>
            <Dropdown
              id="department"
              value={formData.departmentId}
              options={departmentOptions}
              onChange={(e) =>
                setFormData({ ...formData, departmentId: e.value })
              }
              placeholder="Select a department"
              showClear
            />
          </div>

          <div className="form-field">
            <label htmlFor="position">Position *</label>
            <InputText
              id="position"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              className={formErrors.position ? "p-invalid" : ""}
            />
            {formErrors.position && (
              <small className="p-error">{formErrors.position}</small>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="salary">Salary *</label>
            <InputNumber
              id="salary"
              value={formData.salary}
              onValueChange={(e) =>
                setFormData({ ...formData, salary: e.value })
              }
              mode="currency"
              currency="PHP"
              locale="en-PH"
              className={formErrors.salary ? "p-invalid" : ""}
            />
            {formErrors.salary && (
              <small className="p-error">{formErrors.salary}</small>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="hireDate">Hire Date *</label>
            <Calendar
              id="hireDate"
              value={formData.hireDate}
              onChange={(e) => setFormData({ ...formData, hireDate: e.value })}
              dateFormat="mm/dd/yy"
              className={formErrors.hireDate ? "p-invalid" : ""}
            />
            {formErrors.hireDate && (
              <small className="p-error">{formErrors.hireDate}</small>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="status">Status</label>
            <Dropdown
              id="status"
              value={formData.status}
              options={statusOptions}
              onChange={(e) => setFormData({ ...formData, status: e.value })}
            />
          </div>
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
            onClick={saveEmployee}
            disabled={submitting}
          />
        </div>
      </Dialog>

      <ConfirmDialog />
    </div>
  );
};

export default Employees;
