import { Link } from "react-router-dom"

const Unauthorized = () => {
  return (
    <section>
      <h1>Unauthorized 401</h1>
      <h2>You are not authorized to access this page.</h2>
      <p>
        You may need to log in or register to view this page.
        You can try to go to the
        <Link to="/auth/login">login page</Link>
         or the <Link to="/auth/sing-up">register page</Link>.
      </p>
    </section>
  )
}

export default Unauthorized
