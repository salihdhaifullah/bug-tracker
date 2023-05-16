import { ReactNode, useEffect, useId, useState } from "react";
import { IconType } from "react-icons";

const LABEL_FOCUS = "bottom-[95%] left-[12%] text-sm text-secondary";
const LABEL = "text-base bottom-[20%] left-[20%] text-gray-600";


export interface IValidate {
    validate: (str: string) => boolean;
    massage: string
}

interface TextFiledProps {
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    value: string
    label: string
    setIsValid: (bool: boolean) => void;
    type?: React.HTMLInputTypeAttribute
    validation?: IValidate[]
    icon?: IconType
    InElement?: ReactNode
}


const TextFiled = (props: TextFiledProps) => {
    const Id = useId();
    const [isFocus, setIsFocus] = useState(false);
    const [isError, setIsError] = useState(false);
    const [changing, setChanging] = useState(false);
    const [errorMassage, setErrorMassage] = useState("");
    const [labelClassName, setLabelClassName] = useState("absolute z-10 font-extralight transition-all ease-in-out text-base bottom-[20%] left-[20%] text-gray-600");

    useEffect(() => {
        if (props.value) setLabelClassName("sr-only");
        else setLabelClassName(`absolute z-10 font-extralight transition-all ease-in-out  ${isFocus ? LABEL_FOCUS : LABEL}`);
    }, [isFocus, changing])


    const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(e)

        setIsFocus(true)
        setIsError(false)
        setChanging(!changing)

        if (
            !props?.validation ||
             props?.validation.length === 0 ||
            !e.target.value
            ) return;

        for (let i = 0; i < props?.validation.length; i++) {
            const item = props?.validation[i];
            if (!item.validate(e.target.value)) {
                setErrorMassage(item.massage)
                setIsError(true)
                props.setIsValid(false);
                continue;
            }
            props.setIsValid(true);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center p-2 px-6 w-full gap-2">
            <div className="flex flex-row gap-2 w-full justify-center items-center relative">
                <label
                    htmlFor={Id}
                    className={labelClassName}>
                    {props.label}
                </label>
                {!props?.icon ? null : <props.icon className="text-gray-600 text-xl font-bold"/>}
                {!props?.InElement ? null : props.InElement}
                <input
                    className={`p-2 border h-fit rounded-sm w-full ${isError ? "border-red-500 hover:border-red-700 focus:outline-red-600" : "border-gray-400 hover:border-gray-900 focus:outline-secondary"} `}
                    id={Id}
                    type={props?.type}
                    value={props?.value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={handelChange}
                />
            </div>
            {!isError ? null : <p className="text-red-600 text-center text-base font-bold">{errorMassage}</p>}
        </div>
    )
}

export default TextFiled;

