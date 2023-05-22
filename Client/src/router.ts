import Login from "./pages/auth/Login";
import SingUp from "./pages/auth/SingUp";
import NotFound from "./pages/errors/NotFound";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgetPassword from "./pages/auth/ForgetPassword";
import AccountVerification from "./pages/auth/AccountVerification";
import InternalServerError from "./pages/errors/InternalServerError";
import Forbidden from "./pages/errors/Forbidden";
import Unauthorized from "./pages/errors/Unauthorized";
import Profile from "./pages/Profile";

import { createBrowserRouter } from "react-router-dom";
import CreateProject from "./pages/admin/CreateProject";
import Projects from "./pages/admin/Projects";
import Project from "./pages/admin/Project";

const router = createBrowserRouter([{
    path: "/",
    Component: Layout,
    children: [
        { path: "", Component: Home },
        { path: "auth/login", Component: Login },
        { path: "auth/sing-up", Component: SingUp },
        { path: "auth/reset-password", Component: ResetPassword },
        { path: "auth/forget-password", Component: ForgetPassword },
        { path: "auth/account-verification", Component: AccountVerification },
        { path: "admin/create-project", Component: CreateProject },
        { path: "profile/:userId", Component: Profile },
        { path: "projects", Component: Projects },
        { path: "project/:projectId", Component: Project },
        { path: "500", Component: InternalServerError },
        { path: "403", Component: Forbidden },
        { path: "401", Component: Unauthorized },
        { path: "*", Component: NotFound }
    ]
}]);

export default router;
