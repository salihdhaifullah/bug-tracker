import { Link } from "react-router-dom"
import { useUser } from "../../utils/context/user"

const Header = () => {
  const user = useUser();

  return (
    <header>
      <Link to="/">Buegee</Link>
      <div className="flex flex-row gap-2">
        <Link to="/auth/login"
          className="border-2 transition-all shadow-md border-secondary hover:shadow-lg hover:rounded-md text-base text-primary rounded-sm px-2 py-1 bg-white">login</Link>

        {user === null ? null : (
          <img
            className="rounded-full w-10 h-10 object-contain"
            src={`/api/files/public/${user.imageId}`}
            alt={user.fullName} />
        )}

      </div>
    </header>
  )
}

export default Header
