// import React from 'react';

import { FaGithub, FaPlay } from "react-icons/fa"
import Button from "../components/utils/Button"
import { MdTry } from "react-icons/md"

// const Home: React.FC = () => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <img src="/logo.svg" alt="Logo" className="w-32 h-32" />
//       <h1 className="text-2xl font-bold text-gray-900">Welcome to our website!</h1>
//       <p className="mt-4 text-gray-700">
//       </p>
//     </div>
//   );
// }

// export default Home;

const Home = () => {
  return (
    <section className="h-full w-full py-4 px-8 mt-10 mx-auto gap-2 flex flex-row">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-2 text-4xl text-primary dark:text-secondary font-extrabold md:text-5xl xl:text-6xl">
            Buegee
          </h1>
          <h2 className="max-w-2xl mb-4 text-2xl font-bold md:text-3xl xl:text-4xl dark:text-gray-200 text-gray-800">
            Software management tool
          </h2>
          <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            Our Software is a cutting-edge solution designed to streamline your workflow.
            With our robust set of features, you can manage tasks,
            collaborate with your team,
            and track your progress all in one place.
            Whether you're a small business or a large enterprise,
            our Software is committed to helping you achieve your goals
          </p>
          <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">

            <Button className="flex-row flex items-center justify-center gap-2" size="lg">
              <FaPlay />
              <p>get started</p>
            </Button>

            <Button className="flex-row flex items-center justify-center gap-2" size="lg">
              <MdTry />
              <p>demo account</p>
            </Button>

          </div>
        </div>

        <div className="hidden lg:flex w-[40%] h-full justify-center items-center">
          <img src="logo.svg" alt="hero image"  className="h-80 w-80 object-contain"/>
        </div>

    </section>
  )
}

export default Home
