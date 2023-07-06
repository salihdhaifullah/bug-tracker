import { SetStateAction, useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import Button from "./Button";
import { AiOutlineArrowDown } from "react-icons/ai";

interface ISelectButtonProps {
    value: string
    setValue: (value: SetStateAction<string>) => void
    label: string
    options: string[]
    icon?: IconType
    className?: string
}

const SelectButton = (props: ISelectButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<string[]>([]);

    const optionsRef = useRef<string[]>([]);
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

    return (
        <div ref={targetRef} className="w-fit relative">

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
                        className={`${option === props.value ? "bg-slate-200" : ""} block hover:bg-slate-200 rounded-md text-gray-600 p-1 mb-1 text-base cursor-pointer`}
                        value={option}>
                        {option}
                    </option>
                ))}
            </datalist>
        </div>
    )
}

export default SelectButton;
