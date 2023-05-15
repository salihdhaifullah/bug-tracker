import { Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Notifications from "./components/utils/Notifications";
import { Provider } from "./utils/context";

const Root = () => {
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

export default Root;
