import { Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Nonfiction from "./components/utils/Nonfiction";
import { NotificationProvider } from "./utils/context";

const Root = () => {
  return (
    <NotificationProvider>
      <Header />
      <Nonfiction />
      <main>
      <Outlet />
      </main>
      <Footer />
    </NotificationProvider>
  )
}

export default Root;
