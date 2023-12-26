import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Notifications from "./Notifications";
import { useModal } from "../../utils/context/modal";
import Modal from "./Modal";

const Wrapper = () => {
    const modal = useModal();

    return (
        <>
            {modal.isOpen ? <Modal /> : null}
            <div className={`${modal.isOpen ? "blur-sm" : ""} flex flex-col`}>
                <Header />
                <Notifications />
                <main className="flex flex-col min-h-[85vh] mt-16 mb-8 h-auto">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </>
    )
}

export default Wrapper;
