import { MdEmail } from 'react-icons/md';
import TextFiled from '../../components/utils/TextFiled';
import { RiLockPasswordFill } from 'react-icons/ri';
import { FormEvent, useState } from 'react';
import PasswordEye from '../../components/utils/PasswordEye';
import useFetchApi from '../../utils/hooks/useFetchApi';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import Button from '../../components/utils/Button';


const SingUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isValidFirstName, setIsValidFirstName] = useState(false);
  const [isValidLastName, setIsValidLastName] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);

  const [passwordType, setPasswordType] = useState("password");

  const [payload, call] = useFetchApi<unknown, { email: string, password: string, firstName: string, lastName: string }>("POST", "auth/sing-up", []);

  const handelSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    call({ email, password, firstName, lastName });
  }


  return (
    <section className="flex flex-col justify-center items-center flex-grow my-6 ">
      <div className="rounded-xl bg-white flex flex-col gap-4 w-80 p-2 items-center justify-center shadow-xl">

        <div className="flex relative w-full items-center justify-center h-auto">
          <img src="/logo.png" className="w-60 h-40 object-contain" alt="logo" />
        </div>


        <form className="flex-col flex w-full justify-center items-center" onSubmit={handelSubmit}>

          <h1 className="text-primary font-bold text-2xl text-center">sign-up</h1>

          <TextFiled
            validation={[
              { validate: (str: string) => str.length > 0, massage: "first name is required" },
              { validate: (str: string) => str.length <= 50, massage: "max length of first name is 50 character" }
            ]}
            icon={FaUserCircle}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            label="first name"
            setIsValid={setIsValidFirstName}
          />

          <TextFiled
            validation={[
              { validate: (str: string) => str.length > 0, massage: "last name is required" },
              { validate: (str: string) => str.length <= 50, massage: "max length of last name is 50 character" }
            ]}
            icon={FaUserCircle}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            label="last name"
            setIsValid={setIsValidLastName}
          />

          <TextFiled
            validation={[
              {
                validate: (str: string) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str),
                massage: "un-valid email address"
              },
              { validate: (str: string) => str.length <= 100, massage: "max length of email address is 100 character" }
            ]}
            icon={MdEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="email address"
            setIsValid={setIsValidEmail}
          />

          <TextFiled
            validation={[ { validate: (str: string) => str.length >= 8, massage: "min length of password is 8 character" } ]}
            icon={RiLockPasswordFill}
            value={password}
            inputProps={{ type: passwordType }}
            onChange={(e) => setPassword(e.target.value)}
            label="password"
            InElement={<PasswordEye type={passwordType} setType={setPasswordType} />}
            setIsValid={setIsValidPassword}
          />


          <div className="flex justify-end items-center w-full px-4 pb-2">
            <Link to="/auth/login" className="link">login ?</Link>
          </div>

          <div className="flex flex-col justify-center items-center w-full my-1">
            <Button
              buttonProps={{ type: "submit" }}
              isLoading={payload.isLoading}
              isValid={isValidFirstName && isValidLastName && isValidEmail && isValidPassword}
            >submit</Button>
          </div>

        </form>

      </div>
    </section>
  )
}

export default SingUp
