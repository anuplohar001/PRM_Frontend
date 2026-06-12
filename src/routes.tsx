import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Authentications/Login";
import Signup from "./pages/Authentications/Signup";

import DashboardLayout from "./components/layout/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Activity from "./pages/Activity";
import Settings from "./pages/Settings";

// My Issues
import MyIssuesAssigned from "./pages/MyIssues";

// Projects
import ProjectsIndex from "./pages/Projects/Projects";
import ProjectDetail from "./pages/Projects/ProjectDetail";

// Teams
import TeamsIndex from "./pages/Teams/Teams";
import TeamDetail from "./pages/Teams/TeamDetails";
import ChooseWorkspace from "./pages/ChooseWorkspace";

interface AppRoutesProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const lastOrganizationId = localStorage.getItem("lastOrganizationId")
  return (token && lastOrganizationId) ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function AppRoutes({
  theme,
  onToggleTheme,
}: AppRoutesProps) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <LandingPage
            theme={theme}
            onToggleTheme={onToggleTheme}
          />
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/choose-workspace" element={<ChooseWorkspace/>}/>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <DashboardLayout
              theme={theme}
              onToggleTheme={onToggleTheme}
            />
          }
        >
          {/* Home */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* My Issues */}
          <Route
            path="/my-issues"
            element={<MyIssuesAssigned />}
          />

          {/* Projects */}
          <Route path="/projects" element={<ProjectsIndex />} />
          <Route
            path="/projects/:id"
            element={<ProjectDetail />}
          />

          {/* Teams */}
          <Route path="/teams" element={<TeamsIndex />} />
          <Route path="/teams/:id" element={<TeamDetail />} />

          {/* Global */}
          <Route path="/activity" element={<Activity />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}