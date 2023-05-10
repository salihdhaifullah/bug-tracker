import { Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Nonfiction from "./components/utils/Nonfiction";
import { TasksProvider } from "./utils/context";

const Root = () => {
  return (
    <TasksProvider>
      <Header />
      <Nonfiction />
      <main>
      <Outlet />
      </main>
      <Footer />
    </TasksProvider>
  )
}

export default Root;
