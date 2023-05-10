import useApi from "../utils/hooks/useAPi";

const Home = () => {
  const classback = useApi();

    const handel = () => {
      classback("GET", "test");
    }

  return (
    <div>
      <button onClick={handel}>click</button>
    </div>
  )
}

export default Home
