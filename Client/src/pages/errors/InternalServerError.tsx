import { Link } from "react-router-dom";

const InternalServerError = () => {
  return (
    <section>
      <h1>Internal Server Error 500</h1>
      <h2>Something went wrong on our end.</h2>
      <p>
        We apologize for the inconvenience. We are working hard to fix the problem as soon as possible.
        You can try to go to the <Link to="/">home page</Link> or come back later.
      </p>
    </section>
    )
}

export default InternalServerError;
