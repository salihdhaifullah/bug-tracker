import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <section>
      <h1>Not Found 404</h1>
      <h2>The page you requested could not be found.</h2>
      <p>
        The page may have been moved or deleted.
        You can try to go back to the <Link to="/">home page</Link>
      </p>
    </section>
  )
}

export default NotFound
