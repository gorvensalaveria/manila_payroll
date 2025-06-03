import { Menubar } from "primereact/menubar";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      label: "Dashboard",
      icon: "pi pi-home",
      command: () => navigate("/"),
      className: location.pathname === "/" ? "p-menuitem-active" : "",
    },
    {
      label: "Employees",
      icon: "pi pi-users",
      command: () => navigate("/employees"),
      className: location.pathname === "/employees" ? "p-menuitem-active" : "",
    },
    {
      label: "Departments",
      icon: "pi pi-building",
      command: () => navigate("/departments"),
      className:
        location.pathname === "/departments" ? "p-menuitem-active" : "",
    },
  ];

  const start = (
    <div className="flex align-items-center">
      <i
        className="pi pi-briefcase mr-2"
        style={{ fontSize: "1.5rem", color: "#667eea" }}
      ></i>
      <span
        style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#495057" }}
      >
        Manila Payroll
      </span>
    </div>
  );

  const end = (
    <div className="flex align-items-center">
      <span className="text-sm text-600">Employee Management System</span>
    </div>
  );

  return (
    <Menubar
      model={items}
      start={start}
      end={end}
      style={{
        borderRadius: 0,
        border: "none",
        borderBottom: "1px solid #dee2e6",
        background: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    />
  );
};

export default Navbar;
