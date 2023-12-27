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
        { path: "search", Component: Search },
        { path: "users/:userId", Component: Profile },
        { path: "users/:userId/projects", Component: Projects },
        { path: "users/:userId/projects/:projectId", Component: Project },
        { path: "users/:userId/projects/:projectId/tickets/:ticketId", Component: Ticket },
        { path: "users/:userId/projects/:projectId/tickets/assigned", Component: MyTasks },
        { path: "users/:userId/projects/:projectId/members", Component: Members },
        { path: "users/:userId/projects/:projectId/activities", Component: Activities },
        { path: "users/:userId/projects/:projectId/tickets", Component: Tickets },
        { path: "users/:userId/projects/:projectId/danger-zone", Component: DangerZone },
        { path: "500", Component: InternalServerError },
        { path: "403", Component: Forbidden },
        { path: "401", Component: Unauthorized },
        { path: "*", Component: NotFound }
    ]
}]);

export default router;
