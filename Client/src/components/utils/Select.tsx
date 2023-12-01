import { KeyboardEvent, SetStateAction, useEffect, useRef, useState } from "react";
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

const Select = (props: ISelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeOption, setActiveOption] = useState(1);
    const [search, setSearch] = useState(props.value);
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
        setSearch(options[optionIndex])
        setIsOpen(false);
    }

    useEffect(() => {
        const text = search.toLowerCase();
        const data = [];

        for (let option of optionsRef.current) {
            const optionValue = option.toLowerCase();
            if (optionValue.startsWith(text)) data.push(option);
        }

        setOptions(data);
    }, [search])

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
        <div
            ref={targetRef}
            className="flex flex-row gap-2 w-full justify-center items-center relative">
            <TextFiled
                onFocus={() => setIsOpen(true)}
                inputProps={{
                    autoComplete: "off",
                    onKeyUp: handleKeyUp,
                    onKeyDown: handleKeyDown
                }}
                validation={props.validation}
                icon={props.icon}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                label={props.label}
                setIsValid={props.setIsValid}
            />

            <datalist
                className={`${isOpen ? "block" : "none"} absolute w-full shadow-lg z-40 max-h-40 top-[100%] bg-white dark:bg-black no-scrollbar border rounded-md border-t-0 p-2 overflow-y-scroll`}>
                {options.map((option, index) => (
                    <option
                        key={option}
                        id={`option-${index}`}
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
