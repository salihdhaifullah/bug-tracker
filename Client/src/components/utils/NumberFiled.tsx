import { ChangeEventHandler, ForwardedRef, forwardRef, useEffect, useId, useState } from "react";

interface INumberFiledProps {
    onChange: ChangeEventHandler<HTMLInputElement>;
    label: string
    value: number
}


const NumberFiled = forwardRef((props: INumberFiledProps, ref: ForwardedRef<HTMLDivElement>) => {
    const LABEL_FOCUS = `bottom-[95%] left-[2.4%]  text-sm dark:text-secondary text-primary`;
    const LABEL = `text-base "left-[4%] bottom-[20%]  text-gray-700 dark:text-gray-200`;

    const [labelClassName, setLabelClassName] = useState(`absolute z-10 font-extralight transition-all ease-in-out ${LABEL}`);
    const [isFocus, setIsFocus] = useState(false);
    const [changing, setChanging] = useState(false);

    const Id = useId();

    useEffect(() => {
        if (props.value) setLabelClassName("sr-only");
        else setLabelClassName(`absolute z-10 font-extralight transition-all ease-in-out  ${isFocus ? LABEL_FOCUS : LABEL}`);
    }, [isFocus, changing])

    useEffect(() => {
        if (props.value) setLabelClassName("sr-only");
    }, [props.value])


    const onFocus = () => {
        setIsFocus(true)
    }

    const onBlur = () => {
        setIsFocus(false);
    }

    const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(e)

        setIsFocus(true)
        setChanging(!changing)
    }

    return (
        <div ref={ref} className="flex flex-col justify-center items-center w-full gap-2">
            <div className="flex flex-row gap-2 w-full justify-center items-center relative">
                <label
                    htmlFor={Id}
                    className={labelClassName}>
                    {props.label}
                </label>

                <input
                    className="dark:text-white p-1 dark:bg-black border h-fit rounded-sm w-full focus:border-none focus:outline-solid focus:outline-2 dark:border-gray-300 dark:hover:border-white border-gray-700 hover:border-gray-900 focus:outline-primary dark:focus:outline-secondary"
                    id={Id}
                    type="number"
                    autoComplete="off"
                    value={props.value}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handelChange}
                />
            </div>
        </div>
    )
})

export default NumberFiled;

