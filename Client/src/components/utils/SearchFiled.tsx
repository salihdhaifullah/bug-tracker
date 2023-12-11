import { ChangeEventHandler, HTMLProps, KeyboardEvent, useId, useMemo, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface SearchFiledProps {
    label: string
    value: string
    onChange?: ChangeEventHandler<HTMLInputElement>;
    inputProps?: HTMLProps<HTMLInputElement>
    className?: string
    onClick?: () => void

}


const SearchFiled = (props: SearchFiledProps) => {
    const Id = useId();
    const [isFocus, setIsFocus] = useState(false);

    const labelClassName = useMemo(() => {
        if (props.value) return "sr-only"
        else return `absolute z-10 text-sm font-extralight transition-all ease-in-out
        ${isFocus ? `bottom-[95%] left-0 dark:text-secondary text-primary`
                : ` left-[5%] bottom-[20%] text-gray-700 dark:text-gray-200`}`
    }, [props.value, isFocus])

    const onFocus = () => {
        setIsFocus(true)
    }

    const onBlur = () => {
        setIsFocus(false);
    }

    const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props?.onChange && props.onChange(e)
        setIsFocus(true)
    }

    const handelSearch = () => {
        if (props.onClick) props.onClick()
    }

    const handelKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handelSearch();
    }

    return (
        <div className={`flex flex-col justify-center items-center py-0.5 px-3 w-full gap-2 ${props.className || ""}`}>
            <div className="flex flex-row gap-2 w-full justify-center items-center relative">
                <label
                    htmlFor={Id}
                    className={labelClassName}>
                    {props.label}
                </label>
                <input
                    {...props.inputProps}
                    className="py-0.5 px-1 dark:text-white dark:bg-black border h-fit rounded-sm w-full focus:border-none focus:outline-solid focus:outline-2 dark:border-gray-300 dark:hover:border-white border-gray-700 hover:border-gray-900 focus:outline-primary dark:focus:outline-secondary"
                    id={Id}
                    value={props.value}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onKeyDown={handelKeyDown}
                    onChange={handelChange}
                />

                <AiOutlineSearch
                    onClick={handelSearch}
                    className="text-3xl rounded-md text-secondary bg-primary dark:text-primary dark:bg-secondary px-1.5 cursor-pointer" />
            </div>
        </div>
    )
}

export default SearchFiled;
