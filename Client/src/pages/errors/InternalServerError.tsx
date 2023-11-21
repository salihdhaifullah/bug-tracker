import { Link } from "react-router-dom";

const InternalServerError = () => {
  return (
    <section className="flex justify-center items-center flex-col h-full flex-grow w-full gap-4">
      <h1 className="text-primary dark:text-secondary text-2xl font-extrabold">Internal Server Error 500</h1>
      <h2 className="text-primary dark:text-secondary  text-lg font-bold">Something went wrong on our end.</h2>
      <p className="text-primary dark:text-secondary  text-base font-normal text-center px-8">
        We apologize for the inconvenience. We are working hard to fix the problem as soon as possible.
        You can try to go to the <Link to="/" className="link mx-1">home page</Link> or come back later.
      </p>
    </section>
    )
}

export default InternalServerError;
