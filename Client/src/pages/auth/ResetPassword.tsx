import { RiLockPasswordFill } from "react-icons/ri"
import TextFiled from "../../components/utils/TextFiled"
import PasswordEye from "../../components/utils/PasswordEye"
import { FormEvent, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { MdDomainVerification } from "react-icons/md";
import Button from "../../components/utils/Button";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [code, setCode] = useState("");
    const [passwordType, setPasswordType] = useState("password");

    const [isValidPassword, setIsValidPassword] = useState(false);
    const [isValidCode, setIsValidCode] = useState(false);

    const [payload, call] = useFetchApi("POST", "auth/reset-password", [code, newPassword], { code, newPassword });

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

                <h1 className="text-primary font-bold text-2xl text-center">Reset Password</h1>

                <p className="text-primary text-base text-center px-2">
                    check your emails for the verification code, if you did not find it please check spam emails.
                </p>

                <form className="flex-col flex w-full justify-center items-center" onSubmit={handelSubmit}>


                    <TextFiled
                        validation={[
                            { validate: (str: string) => str.length >= 6, massage: "min length of verification code is 6 character" },
                            { validate: (str: string) => str.length <= 6, massage: "max length of verification code is 6 character" },
                            { validate: (str: string) => /^[0-9]+$/.test(str), massage: "verification code should be numbers from 0-9" }
                        ]}
                        icon={MdDomainVerification}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        label="verification code"
                        setIsValid={setIsValidCode}
                    />

                    <TextFiled
                        validation={[
                            { validate: (str: string) => str.length > 8, massage: "min length of password is 8 character" }
                        ]}
                        icon={RiLockPasswordFill}
                        value={newPassword}
                        inputProps={{ type: passwordType }}
                        onChange={(e) => setNewPassword(e.target.value)}
                        label="new password"
                        InElement={<PasswordEye type={passwordType} setType={setPasswordType} />}
                        setIsValid={setIsValidPassword}
                    />




                    <Button
                        buttonProps={{ type: "submit" }}
                        isLoading={payload.isLoading}
                        isValid={isValidCode && isValidPassword} text="submit"
                    />

                </form>

            </div>
        </section>
    )
}

export default ResetPassword
