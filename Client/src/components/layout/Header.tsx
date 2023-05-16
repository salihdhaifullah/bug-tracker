import { Link } from "react-router-dom"

import Sidebar from "./Sidebar";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { IUser, useUserDispatch } from "../../utils/context/user";
import { useEffect } from "react";

const Header = () => {
  const [payload, call] = useFetchApi<IUser>("GET", "user/how-am-i", [])

  const dispatchUser = useUserDispatch();

  useEffect(() => { call() }, []);

  useEffect(() => {
    if (payload.result) dispatchUser({ type: "add", payload: payload.result });
  }, [payload.result]);

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
