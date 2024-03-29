import { MdDomainVerification } from 'react-icons/md';
import TextFiled from '../../components/utils/TextFiled';
import { FormEvent, useState } from 'react';
import useFetchApi from '../../utils/hooks/useFetchApi';
import Button from '../../components/utils/Button';

const AccountVerification = () => {
    const [isValidCode, setIsValidCode] = useState(false);
    const [code, setCode] = useState("");

    const [payload, call] = useFetchApi<any, { code: string }>("POST", "auth/account-verification", []);

    const handelSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        call({ code });
    }

    return (
        <section className="flex flex-col justify-center items-center flex-grow">
            <div className="rounded-xl bg-white dark:bg-black flex flex-col gap-4 w-80 px-4 py-8 items-center justify-center shadow-xl dark:shadow-secondary/40">

                <div className="flex relative w-full items-center justify-center h-auto">
                    <img src="/logo.svg" className="w-20 h-20 object-contain" alt="logo" />
                </div>

                <h1 className="text-primary dark:text-secondary font-bold text-2xl text-center">Account Verification</h1>

                <p className="text-primary dark:text-secondary text-base text-center px-2">
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


                    <div className="flex flex-col justify-center items-center w-full my-1">
                        <Button
                            buttonProps={{ type: "submit" }}
                            isLoading={payload.isLoading}
                            isValid={isValidCode}
                        >submit</Button>
                    </div>
                </form>

            </div>
        </section>
    )
}

export default AccountVerification
