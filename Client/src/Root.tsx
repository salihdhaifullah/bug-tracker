import { Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Notifications from "./components/utils/Notifications";
import { NotificationProvider } from "./utils/context";

const Root = () => {
  return (
    <NotificationProvider>
      <Header />
      <Notifications />
      <main>
      <Outlet />
      </main>
      <Footer />
    </NotificationProvider>
  )
}

export default Root;
