import { FormEvent, useRef, useState } from "react";
import TextFiled from "../../components/utils/TextFiled"
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import useFetchApi from "../../utils/hooks/useFetchApi";
import PasswordEye from "../../components/utils/PasswordEye";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const isValidEmail = useRef(false);
  const isValidPassword = useRef(false);
  const [payload, call] = useFetchApi<undefined>("POST", "auth/login", [email, password], {email, password});

  const handelSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    call();
  }


  return (
    <section className="flex flex-col justify-center items-center flex-grow">
      <div className="rounded-xl bg-white flex flex-col gap-4 w-80 p-2 items-center justify-center shadow-xl">

        <div className="flex relative w-full items-center justify-center h-auto">
          <img src="/logo.png" className="w-60 h-40 object-contain" alt="logo" />
        </div>

        <h1 className="text-primary font-bold text-2xl text-center">login</h1>

        <form className="flex-col flex w-full justify-center items-center" onSubmit={handelSubmit}>

          <TextFiled
            validation={[
              {
                validate: (str: string) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str),
                massage: "un-valid email address"
              },
              {
                validate: (str: string) => str.length <= 100,
                massage: "max length of email address is 100 character"
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
                validate: (str: string) => str.length > 8,
                massage: "min length of password is 8 character"
              }
            ]}
            icon={RiLockPasswordFill}
            value={password}
            type={passwordType}
            onChange={(e) => setPassword(e.target.value)}
            label="password"
            InElement={<PasswordEye type={passwordType} setType={setPasswordType} />}
            isValid={isValidPassword}
          />

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

export default Login;
