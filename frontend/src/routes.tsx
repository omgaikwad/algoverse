import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import ProblemPage from "./pages/ProblemPage/ProblemPage";
// Import other components for different routes

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/problem" element={<ProblemPage />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default AppRoutes;
