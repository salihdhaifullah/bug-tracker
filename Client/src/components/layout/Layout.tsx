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
            <main className="flex flex-col min-h-[85vh] mt-16 mb-8 h-auto">
                <Outlet />
            </main>
            <Footer />
        </Provider>
    )
}

export default Layout;
