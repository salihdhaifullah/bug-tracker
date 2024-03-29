import { MdEmail } from "react-icons/md"
import TextFiled from "../../components/utils/TextFiled"
import { FormEvent, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import Button from "../../components/utils/Button";

const ForgetPassword = () => {
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [email, setEmail] = useState("");

    const [payload, call] = useFetchApi<any, { email: string }>("POST", "auth/forget-password", []);

    const handelSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        call({ email });
    }

    return (
        <section className="flex flex-col justify-center items-center flex-grow">
            <div className="rounded-xl bg-white dark:bg-black flex flex-col gap-4 w-80 px-4 py-8 items-center justify-center shadow-xl dark:shadow-secondary/40">

                <div className="flex relative w-full items-center justify-center h-auto">
                    <img src="/logo.svg" className="w-20 h-20 object-contain" alt="logo" />
                </div>

                <h1 className="text-primary dark:text-secondary font-bold text-2xl text-center">Forget Password</h1>

                <form className="flex-col flex w-full justify-center items-center" onSubmit={handelSubmit}>

                    <TextFiled
                        validation={[
                            { validate: (str: string) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str), massage: "un-valid email address" },
                            { validate: (str: string) => str.length <= 100, massage: "max length of email address is 100 character" }
                        ]}
                        icon={MdEmail}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="email address"
                        setIsValid={setIsValidEmail}
                    />

                    <div className="flex flex-col justify-center items-center w-full my-1">
                        <Button
                            buttonProps={{ type: "submit" }}
                            isLoading={payload.isLoading}
                            isValid={isValidEmail}
                        >submit</Button>
                    </div>

                </form>

            </div>
        </section>
    )
}

export default ForgetPassword
