import { Link } from "react-router-dom"

const Forbidden = () => {
  return (
    <section className="flex justify-center items-center flex-col h-full flex-grow w-full gap-4">
      <h1 className="text-primary text-2xl font-extrabold">Forbidden 403</h1>
      <h2 className="text-primary text-lg font-bold">You do not have permission to do this action</h2>
      <p className="text-primary text-base font-normal text-center px-8">
        The page may be restricted to certain users or roles.
        You can try to go back to the <Link to="/" className="link mx-1">home page</Link>
      </p>
    </section>
  )
}

export default Forbidden
