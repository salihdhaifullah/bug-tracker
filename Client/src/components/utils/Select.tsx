import { KeyboardEvent, SetStateAction, useEffect, useId, useRef, useState } from "react";
import { IconType } from "react-icons";
import TextFiled, { IValidate } from "./TextFiled";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";

interface ISelectProps {
    value: string
    setValue: (value: SetStateAction<string>) => void
    label: string
    setIsValid?: (bool: boolean) => void;
    options: string[]
    validation?: IValidate[]
    icon?: IconType
}

const activeOptionInit = (array: string[], value: string) => {
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

const Select = (props: ISelectProps) => {
    const id = useId();
    const [isOpen, setIsOpen] = useState(false);
    const [activeOption, setActiveOption] = useState(activeOptionInit(props.options, props.value));

    const targetRef = useRef<HTMLDivElement>(null);
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
        <div
            ref={targetRef}
            className="flex flex-row gap-2 w-full justify-center items-center relative">
            <TextFiled
                onFocus={() => setIsOpen(true)}
                inputProps={{
                    autoComplete: "off",
                    onKeyUp: handleKeyUp,
                    onKeyDown: handleKeyDown,
                    readOnly: true
                }}
                validation={props.validation}
                icon={props.icon}
                value={props.value}
                label={props.label}
                setIsValid={props.setIsValid}
            />

            <datalist
                ref={dropdownRef}
                className={`${isOpen ? "block" : "none"}  absolute w-full shadow-lg z-40 max-h-20 top-[100%] bg-white dark:bg-black dark:shadow-secondary/40 rounded-md p-2 overflow-y-scroll thin-scrollbar`}>
                {props.options.map((option, index) => (
                    <option
                        key={option}
                        id={`${id}-option-${index}`}
                        onClick={() => choseOption(index)}
                        className={`${index === activeOption ? "bg-slate-200 dark:bg-slate-800 font-extrabold" : "bg-white dark:bg-black"} block rounded-md text-gray-600 dark:text-gray-400 p-1 mb-1 text-base cursor-pointer`}
                        value={option}>
                        {option}
                    </option>
                ))}
            </datalist>
        </div>
    )
}

export default Select;
