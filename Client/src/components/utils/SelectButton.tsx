import { KeyboardEvent, useEffect, useRef, useState } from "react";
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

function SelectButton<T extends number | string>(props: ISelectButtonProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<T[]>([]);
    const [activeOption, setActiveOption] = useState(1);

    const optionsRef = useRef<T[]>([]);
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        optionsRef.current = props.options;
        setOptions(optionsRef.current);
    }, [props.options])

    useOnClickOutside(targetRef, () => setIsOpen(false));

    const choseOption = (optionIndex: number) => {
        props.setValue(options[optionIndex])
        setIsOpen(false);
    }

    const handelClick = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        document.getElementById(`option-${activeOption - 1}`)?.scrollIntoView({ behavior: "smooth" });
    }, [activeOption])

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown" && activeOption !== (options.length - 1)) {
            setActiveOption((prev) => prev + 1);
        }

        if (e.key === "Enter") choseOption(activeOption)
    }

    const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowUp" && activeOption !== 0) {
            setActiveOption((prev) => prev - 1);
        }
    }

    return (
        <div ref={targetRef} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} className="w-fit relative">

            <Button onClick={handelClick} className={`flex flex-row justify-center items-center gap-1 ${props.className || ""}`}>
                <p>{props.label}</p>
                <AiOutlineArrowDown className={`${isOpen ? "rotate-180" : ""} ease-in-out transition-all`} />
            </Button>

            <datalist
                className={`${isOpen ? "block" : "none"} absolute w-auto shadow-lg z-40 h-auto right-0 top-[100%] bg-white no-scrollbar border rounded-md border-t-0 p-2 overflow-y-scroll`}>
                {options.map((option, index) => (
                    <option
                        key={option}
                        onClick={() => choseOption(index)}
                        className={`${index === activeOption ? "bg-slate-200 font-extrabold" : "bg-white"} block bg-slate-200 rounded-md text-gray-600 p-1 mb-1 text-base cursor-pointer`}
                        value={option}>
                        {option}
                    </option>
                ))}
            </datalist>
        </div>
    )
}

export default SelectButton;
