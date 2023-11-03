import { Link } from "react-router-dom"
import Sidebar from "./Sidebar";

const Header = () => {
  return (
    <header>
      <Link to="/">
        <img src="/logo.png" alt="Buegee" title="Buegee" className="w-20 h-10 object-contain" />
      </Link>
      <div className="flex flex-row gap-2">
        <Sidebar />
      </div>
    </header>
  )
}

export default Header;
