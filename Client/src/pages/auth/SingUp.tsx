const SingUp = () => {
  return (
    <section className="flex flex-col justify-center items-center flex-grow">
      <div className="rounded-xl bg-white flex flex-col gap-4 w-80 p-2 items-center justify-center shadow-xl">

        <div className="flex relative w-full items-center justify-center h-auto">
          <img src="/logo.png" className="w-60 h-40 object-contain" alt="logo" />
        </div>

        <h1 className="text-primary font-bold text-2xl text-center">sign-up</h1>

        <form className="flex-col flex w-full justify-center items-center" action="/auth/sing-up" method="post">

          <div className="flex flex-col justify-center items-center p-2 px-6 w-full gap-2">
            <div className="flex flex-row gap-2  w-full justify-center items-center relative">
              <label className="text-base absolute bottom-[20%] left-[20%] font-extralight text-gray-600 transition-all ease-in-out" htmlFor="FirstName">FirstName</label>
              <i className="fa-solid fa-user text-gray-600 text-base"></i>
              <input className="p-2 border border-gray-400 h-fit hover:border-gray-900 focus:outline-secondary rounded-sm w-full" type="text" id="FirstName" value="@Model.FirstName" name="FirstName" />
            </div>
          </div>

          <div className="flex flex-col justify-center items-center p-2 px-6 w-full gap-2">
            <div className="flex flex-row gap-2  w-full justify-center items-center relative">
              <label className="text-base absolute bottom-[20%] left-[20%] font-extralight text-gray-600 transition-all ease-in-out" htmlFor="LastName">LastName</label>
              <i className="fa-solid fa-user text-gray-600 text-base"></i>
              <input className="p-2 border border-gray-400 h-fit hover:border-gray-900 focus:outline-secondary rounded-sm w-full" type="text" id="LastName" value="@Model.LastName" name="LastName" />
            </div>
          </div>

          <div className="flex flex-col justify-center items-center p-2 px-6 w-full gap-2">
            <div className="flex flex-row gap-2  w-full justify-center items-center relative">
              <label className="text-base absolute bottom-[20%] left-[20%] font-extralight text-gray-600 transition-all ease-in-out" htmlFor="Email">Email</label>
              <i className="fa-solid fa-envelope text-gray-600 text-base"></i>
              <input className="p-2 border border-gray-400 h-fit hover:border-gray-900 focus:outline-secondary rounded-sm w-full" type="text" id="Email" value="@Model.Email" name="Email" />
            </div>
          </div>

          <div className="flex flex-col justify-center items-center p-2 px-6 w-full gap-2">
            <div className="flex flex-row gap-2  w-full justify-center items-center relative">
              <label className="text-base absolute bottom-[20%] left-[20%] font-extralight text-gray-600 transition-all ease-in-out" htmlFor="Password">Password</label>
              <i className="fa-solid fa-key text-gray-600 text-base"></i>
              <input className="p-2 border border-gray-400 h-fit hover:border-gray-900 focus:outline-secondary rounded-sm w-full" type="text" id="Password" value="@Model.Password" name="Password" />
            </div>
          </div>

          <div className="flex justify-center">
            <button type="submit"
              className="text-primary bg-secondary text-center p-2 rounded-md border-0 text-base font-bold cursor-pointer transition-all  ease-in-out shadow-lg hover:shadow-xl hover:text-lg hover:border-gray-600 hover:text-white">
              submit
            </button>
          </div>

        </form>

      </div>
    </section>
  )
}

export default SingUp
