import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import { ToastProvider } from "./contexts/ToastContext";

function App() {
  return (
    <PrimeReactProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/departments" element={<Departments />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ToastProvider>
    </PrimeReactProvider>
  );
}

export default App;
