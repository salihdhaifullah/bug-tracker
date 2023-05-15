import { MdEmail } from "react-icons/md"
import TextFiled from "../../components/utils/TextFiled"
import { FormEvent, useState } from "react";
import CircleProgress from "../../components/utils/CircleProgress";
import useFetchApi from "../../utils/hooks/useFetchApi";

const ForgetPassword = () => {
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [email, setEmail] = useState("");

    const [payload, call] = useFetchApi("POST", "auth/forget-password", [email], { email });

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

                <h1 className="text-primary font-bold text-2xl text-center">Forget Password</h1>

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

                    <div className="flex justify-center">
                        {(payload.isLoading || !isValidEmail) ? (
                            <button disabled
                                className="text-primary bg-gray-300 min-w-[50px] text-center p-2 cursor-not-allowed rounded-md border-0 text-base font-bold shadow-md">
                                {payload.isLoading ? <CircleProgress size="md" /> : "submit"}
                            </button>
                        ) : (
                            <button type="submit"
                                className="text-primary bg-secondary text-center p-2 rounded-md border-0 text-base font-bold cursor-pointer transition-all  ease-in-out shadow-lg hover:shadow-xl hover:border-gray-600 hover:text-white">
                                submit
                            </button>
                        )}
                    </div>

                </form>

            </div>
        </section>
    )
}

export default ForgetPassword
