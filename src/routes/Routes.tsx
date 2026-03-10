import { Routes, Route, Navigate } from "react-router-dom"
import Login from "../pages/Authentications/Login"
import Signup from "../pages/Authentications/Signup"
import NotFound from "../pages/NotFound"
import WorkSpace from "../pages/Home/WorkSpace"

type PrivateRouteProps = {
    children: React.ReactElement
}

const publicRoutes = [
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "*", element: <NotFound /> },
];

const protectedRoutes = [
    { path: "/", element: <WorkSpace /> },
];

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const isAuthenticated = localStorage.getItem("authUser");

    return isAuthenticated ? (
        children
    ) : (
        <Navigate to="/login" replace />
    );
};

const AppRoutes = () => {
    return (
        <Routes>
            {publicRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
            ))}

            {protectedRoutes.map(({ path, element }) => (
                <Route
                    key={path}
                    path={path}
                    element={<PrivateRoute>{element}</PrivateRoute>}
                />
            ))}
        </Routes>
    );
};

export default AppRoutes;