import { KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { IconType } from "react-icons";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import Button from "./Button";
import { AiOutlineArrowDown } from "react-icons/ai";

interface ISelectButtonProps<T extends number | string> {
    value: T
    setValue: (value: T) => void
    label: string
    options: T[]
    icon?: IconType
    className?: string
}

const activeOptionInit = (array: (string | number)[], value: string | number) => {
    const option = array.indexOf(value);
    if (option > -1) return option;
    else return 0;
}

const scrollToEle = (container: HTMLElement, ele: HTMLElement) => {
    const containerRect = container.getBoundingClientRect();
    const elementRect = ele.getBoundingClientRect();

    const yAxisPosition = elementRect.top - containerRect.top + container.scrollTop;

    container.scrollTop = yAxisPosition;
}

function SelectButton<T extends number | string>(props: ISelectButtonProps<T>) {
    const id = useId();
    const [isOpen, setIsOpen] = useState(false);
    const targetRef = useRef<HTMLDivElement>(null);
    const [activeOption, setActiveOption] = useState(activeOptionInit(props.options, props.value));

    const dropdownRef = useRef<HTMLDataListElement>(null);

    useOnClickOutside(targetRef, () => setIsOpen(false));

    const choseOption = (optionIndex: number) => {
        props.setValue(props.options[optionIndex])
        setIsOpen(false);
    }

    useEffect(() => {
        const ele = document.getElementById(`${id}-option-${activeOption}`);
        if (dropdownRef.current && ele) scrollToEle(dropdownRef.current, ele);
    }, [activeOption, isOpen])

    useEffect(() => {
        setActiveOption(activeOptionInit(props.options, props.value))
    }, [isOpen])

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.key === "ArrowDown" && activeOption !== (props.options.length - 1)) {
            setActiveOption((prev) => prev + 1);
        }

        if (e.key === "Enter") choseOption(activeOption)

    }

    const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.key === "ArrowUp" && activeOption !== 0) {
            setActiveOption((prev) => prev - 1);
        }
    }

    return (
        <div ref={targetRef} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} className="w-fit relative">

            <Button onClick={() => setIsOpen(!isOpen)} className={`flex flex-row justify-center items-center gap-1 ${props.className || ""}`}>
                <p>{props.label}</p>
                <AiOutlineArrowDown className={`${isOpen ? "rotate-180" : ""} ease-in-out transition-all`} />
            </Button>

            <datalist
            ref={dropdownRef}
                className={`${isOpen ? "block" : "none"} absolute w-auto shadow-lg dark:shadow-secondary/40 z-40 h-auto max-h-20 right-0 top-[100%] bg-white dark:bg-black rounded-md p-2 overflow-y-scroll thin-scrollbar`}
            >
                {props.options.map((option, index) => (
                    <option
                        id={`${id}-option-${index}`}
                        key={option}
                        onClick={() => choseOption(index)}
                        className={`${activeOption === index ? "bg-slate-200 dark:bg-slate-800 font-extrabold" : "bg-white dark:bg-black"} block rounded-md text-gray-600 dark:text-gray-400 p-1 mb-1 text-base cursor-pointer`}
                        value={option}>
                        {option}
                    </option>
                ))}
            </datalist>
        </div>
    )
}

export default SelectButton;
