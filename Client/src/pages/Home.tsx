import useFetchApi from "../utils/hooks/useFetchApi";

interface IResult {
id: number
role: string
token: string
}

const Home = () => {
  const [_, call] = useFetchApi<IResult>("GET", "test");

  return (
    <div>
      <button onClick={call}>click</button>
    </div>
  )
}

export default Home
