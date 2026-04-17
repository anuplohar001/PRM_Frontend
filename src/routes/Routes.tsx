import { Routes, Route, Navigate } from "react-router-dom"
import Login from "../pages/Authentications/Login"
import Signup from "../pages/Authentications/Signup"
import NotFound from "../pages/NotFound"
import WorkSpace from "../pages/Home/WorkSpace"
import CreateOrganization from "../pages/Organization/CreateOrganization"
import MainLayout from "../layouts/MainLayout"
import CreateProject from "../pages/Project/CreateProject"
import Profile from "../pages/Profile/Profile"
import SuperAdmin from "../pages/SuperAdmin/SuperAdmin"
import Organization from "../pages/Organization/Organization"
import SelectOrganization from "../pages/Organization/SelectOrganization"
import CreateUser from "../pages/Organization/CreateUser"
import Project from "../pages/Project/Project"
import ViewProject from "../pages/Project/ViewProject"
import Team from "../pages/Team/Team"
import CreateTeam from "../pages/Team/CreateTeam"
import ViewTeam from "../pages/Team/ViewTeam"
import CreateWorkflow from "../pages/Home/CreateWorkflow"

type PrivateRouteProps = {
    children: React.ReactElement
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const isAuthenticated = localStorage.getItem("user")

    return isAuthenticated
        ? children
        : <Navigate to="/login" replace />
}

const AppRoutes = () => {
    return (
        <Routes>

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected layout */}
            <Route
                element={
                    <PrivateRoute>
                        <MainLayout />
                    </PrivateRoute>
                }
            >
                <Route path="/select-organization" element={<SelectOrganization />} />

                <Route path="/super-admin-dashboard" element={<SuperAdmin />} />
                <Route path="/" element={<WorkSpace />} />

                <Route path="/organization" element={<Organization />} />
                <Route path="/create-user" element={<CreateUser />} />


                <Route path="/projects" element={<Project />} />
                <Route path="/create-project" element={<CreateProject />} />
                <Route path="/update-project/:id" element={<CreateProject />} />
                <Route path="/view-project/:id" element={<ViewProject />} />


                <Route path="/teams" element={<Team />} />
                <Route path="/create-team" element={<CreateTeam />} />
                <Route path="/view-team/:id" element={<ViewTeam />} />


                <Route path="/teams" element={<Team />} />
                <Route path="/create-workflow" element={<CreateWorkflow />} />


                <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="/create-organization" element={<CreateOrganization />} />
            <Route path="*" element={<NotFound />} />

        </Routes>
    )
}

export default AppRoutes