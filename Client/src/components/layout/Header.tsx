import { Link } from "react-router-dom"
import { useUser, useUserDispatch } from "../../utils/context/user"
import useFetchApi from "../../utils/hooks/useFetchApi";
import CircleProgress from "../utils/CircleProgress";

const Header = () => {
  const user = useUser();
  const userDispatch = useUserDispatch();
  const [payload, call] = useFetchApi("GET", "auth/logout", []);

  const handelLogout = () => {
    call();
    userDispatch({ type: "logout" })
  }

  return (
    <header>
      <Link to="/" className="text-xl font-black">Buegee</Link>
      <div className="flex flex-row gap-2">

        {!user ? (
          <Link
            to="/auth/login"
            className="border-2 transition-all shadow-md border-secondary hover:shadow-lg hover:rounded-md text-base text-primary rounded-sm px-2 py-1 bg-white">
            login
          </Link>
        ) : (
          <>
            <button
              onClick={handelLogout}
              className="border-2 transition-all shadow-md border-secondary hover:shadow-lg hover:rounded-md text-base text-primary rounded-sm px-2 py-1 bg-white">
              {payload.isLoading ? <CircleProgress size="md" /> : "logout"}
            </button>

            <img
              className="rounded-full w-10 h-10 object-contain"
              src={`/api/files/public/${user.imageId}`}
              alt={user.fullName} />
          </>
        )}

      </div>
    </header>
  )
}

export default Header
