import { KeyboardEvent, SetStateAction, useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import TextFiled, { IValidate } from "./TextFiled";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";

interface ISelectProps {
    value: string
    setValue: (value: SetStateAction<string>) => void
    label: string
    setIsValid: (bool: boolean) => void;
    options: Object[]
    validation?: IValidate[]
    icon?: IconType
}

interface IOption {
    key: string,
    value: string
}

const Select = (props: ISelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeOption, setActiveOption] = useState(1);
    const [search, setSearch] = useState("");
    const [options, setOptions] = useState<{ key: string, value: string }[]>([]);

    // ref to store options after possessing them
    const optionsRef = useRef<IOption[]>([]);
    const targetRef = useRef<HTMLDivElement>(null);


    // abstractly handel the array of object as the first propriety
    // in the object as the key ad the second is the value

    useEffect(() => {
        for (const option of props.options) {
            const [key, value] = Object.keys(option);

           // @ts-ignore
            optionsRef.current.push({ key: option[key], value: option[value] })
        }

        setOptions(optionsRef.current);
    }, [props.options])


    useOnClickOutside(targetRef, () => setIsOpen(false));

    const choseOption = (optionIndex: number) => {
        props.setValue(options[optionIndex].key)
        setSearch(options[optionIndex].value)
        setIsOpen(false);
    }

    // filter option based on search input
    useEffect(() => {
        const text = search.toLowerCase();
        const data = [];

        for (let option of optionsRef.current) {
            const optionValue = option.value.toLowerCase();
            if (optionValue.startsWith(text)) data.push(option);
        }

        setOptions(data);
    }, [search])

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
                className={`${isOpen ? "block" : "none"} absolute w-full shadow-lg max-h-40 top-[100%] bg-white no-scrollbar border rounded-md border-t-0 p-2 overflow-y-scroll`}>
                {options.map((option, index) => (
                    <option
                        key={option.key}
                        onClick={() => choseOption(index)}
                        className={`${index === activeOption ? "bg-slate-200 font-extrabold" : "bg-white"} block bg-slate-200 rounded-md text-gray-600 p-1 mb-1 text-base cursor-pointer`}
                        value={option.value}>
                            {option.value}
                    </option>
                ))}
            </datalist>
        </div>
    )
}

export default Select;
