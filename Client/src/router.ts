import Layout from "./components/layout/Layout";
import { createBrowserRouter } from "react-router-dom";

import Login from "./pages/auth/Login";
import SingUp from "./pages/auth/SingUp";
import NotFound from "./pages/errors/NotFound";
import Home from "./pages/Home";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgetPassword from "./pages/auth/ForgetPassword";
import AccountVerification from "./pages/auth/AccountVerification";
import InternalServerError from "./pages/errors/InternalServerError";
import Forbidden from "./pages/errors/Forbidden";
import Unauthorized from "./pages/errors/Unauthorized";
import Profile from "./pages/Profile";
import Project from "./pages/Project";
import Ticket from "./pages/Ticket";
import MyTasks from "./pages/MyTasks";
import Projects from "./pages/Projects";
import Search from "./pages/Search";
import Members from "./pages/Members";
import Activities from "./pages/Activities";
import Tickets from "./pages/Tickets";
import DangerZone from "./pages/DangerZone";

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
        { path: "profile/:userId", Component: Profile },
        { path: "search", Component: Search },
        { path: "projects/:userId", Component: Projects },
        { path: "project/:projectId", Component: Project },
        { path: "ticket/:ticketId", Component: Ticket },
        { path: "my-tasks/:projectId", Component: MyTasks },
        { path: "members/:projectId", Component: Members },
        { path: "activities/:projectId", Component: Activities },
        { path: "tickets/:projectId", Component: Tickets },
        { path: "danger-zone/:projectId", Component: DangerZone },
        { path: "500", Component: InternalServerError },
        { path: "403", Component: Forbidden },
        { path: "401", Component: Unauthorized },
        { path: "*", Component: NotFound }
    ]
}]);

export default router;
