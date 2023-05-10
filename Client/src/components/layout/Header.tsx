import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header>
      <Link to="/">Buegee</Link>
      <div className="flex flex-row gap-2">
        <Link to="/auth/login"
        className="border-2 transition-all shadow-md border-secondary hover:shadow-lg hover:rounded-md text-base text-primary rounded-sm px-2 py-1 bg-white">login</Link>
        <img className="rounded-full w-10 h-10 object-contain" src="https://api.dicebear.com/6.x/identicon/svg?seed=test" alt="my logo" />
      </div>
    </header>
  )
}

export default Header
