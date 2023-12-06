import { ChangeEventHandler, ForwardedRef, HTMLProps, ReactNode, forwardRef, useEffect, useId, useState } from "react";
import { IconType } from "react-icons";

export interface IValidate {
    validate: (str: string) => boolean;
    massage: string
}

interface TextFiledProps {
    label: string
    value: string
    onChange?: ChangeEventHandler<HTMLInputElement>;
    setIsValid?: (bool: boolean) => void;
    validation?: IValidate[]
    icon?: IconType
    InElement?: ReactNode
    inputProps?: HTMLProps<HTMLInputElement>
    onFocus?: () => void
    onBlur?: () => void
    maxLength?: number
    error?: string
    small?: boolean
    className?: string
}


const TextFiled = forwardRef((props: TextFiledProps, ref: ForwardedRef<HTMLDivElement>) => {
    const LABEL_FOCUS = `bottom-[95%] ${props?.icon ? "left-[12%]" : "left-[2.4%]"}  text-sm dark:text-secondary text-primary`;
    const LABEL = `text-base ${props?.icon ? "left-[20%]" : "left-[4%]"} bottom-[20%]  text-gray-700 dark:text-gray-200`;

    const Id = useId();
    const [isFocus, setIsFocus] = useState(false);
    const [isError, setIsError] = useState(false);
    const [changing, setChanging] = useState(false);
    const [errorMassage, setErrorMassage] = useState("");
    const [labelClassName, setLabelClassName] = useState(`absolute z-10 font-extralight transition-all ease-in-out ${LABEL}`);

    useEffect(() => {
        if (props.error) {
            setIsError(true)
            setErrorMassage(props.error)
        } else {
            setIsError(false)
            setErrorMassage("")
        }
    }, [props.error])

    useEffect(() => {
        if (props.value) setLabelClassName("sr-only");
        else setLabelClassName(`absolute z-10 font-extralight transition-all ease-in-out  ${isFocus ? LABEL_FOCUS : LABEL}`);
    }, [isFocus, changing])

    useEffect(() => {
        if (props.value) setLabelClassName("sr-only");
    }, [props.value])

    const onFocus = () => {
        setIsFocus(true)
        if (props?.onFocus) props.onFocus();
    }

    const onBlur = () => {
        setIsFocus(false);
        if (props?.onBlur) props.onBlur();
    }

    const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props?.onChange && props.onChange(e)

        setIsFocus(true)
        setIsError(false)
        setChanging(!changing)
    }

    useEffect(() => {
        if (
            !props?.validation ||
            props?.validation.length === 0 ||
            !props.value
        ) return;

        for (let i = 0; i < props?.validation.length; i++) {
            const item = props?.validation[i];
            if (!item.validate(props.value)) {
                setErrorMassage(item.massage)
                setIsError(true)
                if (props?.setIsValid !== undefined) props.setIsValid(false);
                continue;
            }
            if (props?.setIsValid !== undefined) props.setIsValid(true);
        }
    }, [props.value])

    return (
        <div ref={ref} className={`flex flex-col justify-center items-center ${props.small ? "p-1 px-3" : "p-2 px-6"} w-full gap-2 ${props.className || ""}`}>
            <div className="flex flex-row gap-2 w-full justify-center items-center relative">
                <label
                    htmlFor={Id}
                    className={labelClassName}>
                    {props.label}
                </label>
                {!props?.icon ? null : <props.icon className="text-gray-700 dark:text-gray-50 text-2xl font-bold" />}
                {!props?.InElement ? null : props.InElement}
                <input
                    {...props.inputProps}
                    className={`${props.small ? "p-1" : "p-2"} dark:text-white dark:bg-black border h-fit rounded-sm w-full focus:border-none focus:outline-solid focus:outline-2 ${isError ? "border-red-600 hover:border-red-800 dark:border-red-400 dark:hover:border-red-500 focus:outline-red-600 dark:focus:outline-red-400" : "dark:border-gray-300 dark:hover:border-white border-gray-700 hover:border-gray-900 focus:outline-primary dark:focus:outline-secondary"}`}
                    id={Id}
                    value={props.value}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handelChange}
                    maxLength={props.maxLength}
                />
            </div>
            {!isError
                ? (props.maxLength !== undefined
                    && <p className="text-gray-700 dark:text-gray-200 text-center text-xs font-light">You have {props.maxLength - props.value.length} characters remaining out of a maximum of {props.maxLength}.</p>)
                : <p className="text-red-600 dark:text-red-400 text-center text-sm">{errorMassage}</p>}
        </div>
    )
})

export default TextFiled;

