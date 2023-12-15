import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-white w-full dark:bg-black p-4 shadow-xl dark:shadow-secondary/40">

        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center mb-2 gap-2">
            <img src="/logo.svg" className="h-12 w-12" alt="Buegee Logo" />
            <span className="text-center text-2xl font-semibold whitespace-nowrap dark:text-secondary text-primary">Buegee</span>
          </Link>

          <ul className="flex flex-wrap gap-4 items-center mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
            <li className="hover:underline">
              About
            </li>
            <li className="hover:underline">
              Privacy Policy
            </li>
            <li className="hover:underline">
              Licensing
            </li>
            <li className="hover:underline">
              Contact
            </li>
          </ul>

        </div>

        <hr className="border-gray-200 my-3 dark:border-gray-700" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">&copy; {new Date().getFullYear()} - <Link to="/" className="hover:underline dark:text-secondary text-primary">Buegee</Link>. All Rights Reserved.</span>
    </footer>
  )
}

export default Footer
