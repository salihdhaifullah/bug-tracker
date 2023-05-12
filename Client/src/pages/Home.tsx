import { useEffect } from "react";
import useFetchApi from "../utils/hooks/useFetchApi";

interface IResult {
id: number
role: string
token: string
}

const Home = () => {
  const [payload, call] = useFetchApi<IResult>("GET", "test");

  useEffect(() => {
    console.log(payload.result?.id);
  }, [payload])

  return (
    <div>
      <button onClick={call}>click</button>
    </div>
  )
}

export default Home
