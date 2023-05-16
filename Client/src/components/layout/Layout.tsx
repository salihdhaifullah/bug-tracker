import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Notifications from "./Notifications";
import Provider from "../../utils/context";

const Layout = () => {
  return (
    <Provider>
      <Header />
      <Notifications />
      <main>
        <Outlet />
      </main>
      <Footer />
    </Provider>
  )
}

export default Layout;
