import { useRef, useState } from "react";
import TextFiled from "../../components/utils/TextFiled"
import { MdEmail } from "react-icons/md";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isValidEmail = useRef(true);
  const isValidPassword = useRef(true);

  return (
    <section className="flex flex-col justify-center items-center flex-grow">
      <div className="rounded-xl bg-white flex flex-col gap-4 w-80 p-2 items-center justify-center shadow-xl">

        <div className="flex relative w-full items-center justify-center h-auto">
          <img src="/logo.png" className="w-60 h-40 object-contain" alt="logo" />
        </div>

        <h1 className="text-primary font-bold text-2xl text-center">login</h1>

        <form className="flex-col flex w-full justify-center items-center" action="/auth/login" method="post">

          <div className="flex flex-col justify-center items-center p-2 px-6 w-full gap-2">
            <div className="flex flex-row gap-2  w-full justify-center items-center relative">
              <label className="text-base absolute bottom-[20%] left-[20%] font-extralight text-gray-600 transition-all ease-in-out" htmlFor="Email">email</label>
              <i className="fa-solid fa-envelope text-gray-600 text-base"></i>
              <input className="p-2 border border-gray-400 h-fit hover:border-gray-900 focus:outline-secondary rounded-sm w-full" type="text" id="Email" value="@Model.Email" name="Email" />
            </div>
          </div>
          <TextFiled
            validation={[
              {
                validate: (str: string) => str.length >= 10,
                massage: "unValved Email Address"
              }
            ]}
            icon={MdEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="email address"
            isValid={isValidEmail}
          />

          <TextFiled
            validation={[
              {
                validate: (str: string) => str.length >= 10,
                massage: "unValved password"
              }
            ]}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="password"
            isValid={isValidPassword}
          />

          <div className="flex flex-col justify-center items-center p-2 px-6 w-full gap-2">
            <div className="flex flex-row gap-2  w-full justify-center items-center relative">
              <label className="text-base absolute bottom-[20%] left-[20%] font-extralight text-gray-600 transition-all ease-in-out" htmlFor="Password">password</label>
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

export default Login
