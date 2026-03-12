import { Routes, Route, Navigate } from "react-router-dom"
import Login from "../pages/Authentications/Login"
import Signup from "../pages/Authentications/Signup"
import NotFound from "../pages/NotFound"
import WorkSpace from "../pages/Home/WorkSpace"
import CreateOrganization from "../pages/Organization/CreateOrganization"
import MainLayout from "../layouts/MainLayout"
import CreateProject from "../pages/Project/CreateProject"

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
                <Route path="/" element={<WorkSpace />} />
                <Route path="/create-organization" element={<CreateOrganization />} />
                <Route path="/create-project" element={<CreateProject />} />
            </Route>

            <Route path="*" element={<NotFound />} />

        </Routes>
    )
}

export default AppRoutes