import { Link } from "react-router-dom"
import Sidebar from "./Sidebar";

const Header = () => {
  return (
    <header>
      <Link to="/" className="text-xl font-black">Buegee</Link>
      <div className="flex flex-row gap-2">
      <Sidebar />
      </div>
    </header>
  )
}

export default Header
