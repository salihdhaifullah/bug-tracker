import { Link } from "react-router-dom"

const Forbidden = () => {
  return (
    <section>
      <h1>Forbidden 403</h1>
      <h2>You do not have permission to do this action</h2>
      <p>
        The page may be restricted to certain users or roles.
        You can try to go back to the <Link to="/">home page</Link>
      </p>
    </section>
  )
}

export default Forbidden
