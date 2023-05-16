import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <section className="flex justify-center items-center flex-col h-full flex-grow w-full gap-4">
      <h1 className="text-primary text-2xl font-extrabold">Not Found 404</h1>
      <h2 className="text-primary text-lg font-bold">The page you requested could not be found.</h2>
      <p className="text-primary text-base font-normal text-center px-8">
        The page may have been moved or deleted.
        You can try to go back to the <Link to="/" className="link mx-1">home page</Link>
      </p>
    </section>
  )
}

export default NotFound
