import { Link } from "react-router-dom"

const Unauthorized = () => {
  return (
    <section className="flex justify-center items-center flex-col h-full flex-grow w-full gap-4">
      <h1 className="text-primary dark:text-secondary  text-2xl font-extrabold">Unauthorized 401</h1>
      <h2 className="text-primary dark:text-secondary  text-lg font-bold">You are not authorized to access this page.</h2>
      <p className="text-primary dark:text-secondary  text-base font-normal text-center px-8">
        You may need to log in or register to view this page.
        You can try to go to the
        <Link to="/auth/login" className="link mx-1">login page</Link>
         or the <Link to="/auth/sing-up" className="link mx-1">sing-up page</Link>.
      </p>
    </section>
  )
}

export default Unauthorized
