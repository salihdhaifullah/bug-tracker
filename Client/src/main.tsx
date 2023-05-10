import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/Login";
import SingUp from "./pages/auth/SingUp";
import NotFound from "./pages/errors/NotFound";
import Root from "./Root";
import Home from "./pages/Home";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgetPassword from "./pages/auth/ForgetPassword";
import AccountVerification from "./pages/auth/AccountVerification";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    // errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "auth/login",
        element: <Login />,
      },
      {
        path: "auth/sing-up",
        element: <SingUp />,
      },
      {
        path: "auth/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "auth/forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "auth/account-verification",
        element: <AccountVerification />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
