"use client";

import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { ProgressSpinner } from "primereact/progressspinner";
import { statsAPI } from "../services/api";
import { useToast } from "../contexts/ToastContext";
import { format } from "date-fns";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await statsAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      showError("Error", "Failed to fetch dashboard statistics");
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentChartData = () => {
    if (!stats?.departmentBreakdown) return {};

    return {
      labels: stats.departmentBreakdown.map((dept) => dept.department),
      datasets: [
        {
          data: stats.departmentBreakdown.map((dept) => dept.count),
          backgroundColor: [
            "#667eea",
            "#764ba2",
            "#f093fb",
            "#f5576c",
            "#4facfe",
          ],
          hoverBackgroundColor: [
            "#5a6fd8",
            "#6a4190",
            "#ee7ae9",
            "#f3455a",
            "#3d9afc",
          ],
        },
      ],
    };
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

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
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Overview of your employee management system
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-grid">
        <Card className="stats-card">
          <h3>{stats?.totalEmployees || 0}</h3>
          <p>Total Employees</p>
        </Card>

        <Card
          className="stats-card"
          style={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          }}
        >
          <h3>{stats?.activeEmployees || 0}</h3>
          <p>Active Employees</p>
        </Card>

        <Card
          className="stats-card"
          style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          }}
        >
          <h3>₱{stats?.averageSalary?.toLocaleString() || 0}</h3>
          <p>Average Salary</p>
        </Card>

        <Card
          className="stats-card"
          style={{
            background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
          }}
        >
          <h3>{stats?.departmentBreakdown?.length || 0}</h3>
          <p>Departments</p>
        </Card>
      </div>

      <div className="grid">
        {/* Department Breakdown Chart */}
        <div className="col-12 md:col-6">
          <div className="chart-container">
            <h3 style={{ marginBottom: "1rem", color: "#495057" }}>
              Employees by Department
            </h3>
            <Chart
              type="doughnut"
              data={getDepartmentChartData()}
              options={chartOptions}
              style={{ height: "300px" }}
            />
          </div>
        </div>

        {/* Recent Employees */}
        <div className="col-12 md:col-6">
          <div className="recent-employees">
            <h3 style={{ marginBottom: "1rem", color: "#495057" }}>
              Recent Employees
            </h3>
            {stats?.recentEmployees?.map((employee) => (
              <div key={employee.id} className="recent-employee-item">
                <div className="employee-avatar">
                  {employee.first_name.charAt(0)}
                  {employee.last_name.charAt(0)}
                </div>
                <div className="recent-employee-info flex-1">
                  <h4>
                    {employee.first_name} {employee.last_name}
                  </h4>
                  <p>
                    {employee.position} • {employee.department_name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="salary-amount">
                    ₱{employee.salary?.toLocaleString()}
                  </div>
                  <div className="text-sm text-600">
                    {format(new Date(employee.hire_date), "MMM dd, yyyy")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
