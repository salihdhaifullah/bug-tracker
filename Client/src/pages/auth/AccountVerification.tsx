import { MdDomainVerification } from 'react-icons/md';
import TextFiled from '../../components/utils/TextFiled';
import { FormEvent, useState } from 'react';
import CircleProgress from '../../components/utils/CircleProgress';
import useFetchApi from '../../utils/hooks/useFetchApi';

const AccountVerification = () => {
    const [isValidCode, setIsValidCode] = useState(false);
    const [code, setCode] = useState("");

    const [payload, call] = useFetchApi("POST", "auth/account-verification", [code], { code });

    const handelSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        call();
    }

    return (
        <section className="flex flex-col justify-center items-center flex-grow">
            <div className="rounded-xl bg-white flex flex-col gap-4 w-80 p-2 items-center justify-center shadow-xl">

                <div className="flex relative w-full items-center justify-center h-auto">
                    <img src="/logo.png" className="w-60 h-40 object-contain" alt="logo" />
                </div>

                <h1 className="text-primary font-bold text-2xl text-center">Account Verification</h1>

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

                    <div className="flex justify-center">
                        {(payload.isLoading || !isValidCode) ? (
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

export default AccountVerification
