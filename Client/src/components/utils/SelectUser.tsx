import { useEffect, useRef, useState, KeyboardEvent } from "react";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import useFetchApi from "../../utils/hooks/useFetchApi";
import TextFiled from "./TextFiled";
import CircleProgress from "./CircleProgress";

interface ISelectToInventProps {
    setId: (value: string) => void;
    id: string;
    route: string;
    required?: boolean;
    notMe?: boolean;
    search?: string;
    setIsValid?: (bool: boolean) => void;
    label: string;
}

interface Option {
    avatarUrl: string
    email: string
    name: string;
    id: string;
}

const SelectUser = (props: ISelectToInventProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeOption, setActiveOption] = useState(1);
    const [search, setSearch] = useState(props.search || "");

    const targetRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(targetRef, () => setIsOpen(false));

    const [payload, call] = useFetchApi<Option[]>("GET", `member/${props.route}?email=${search}&not-me=${props.notMe || false}`, [search]);

    useEffect(() => { call(); }, [search])

    const choseOption = (optionIndex: number) => {
        setSearch(payload.result![optionIndex].email);
        props.setId(payload.result![optionIndex].id);
        setIsOpen(false);
    }

    useEffect(() => {
        document.getElementById(`option-${activeOption - 1}`)?.scrollIntoView({ behavior: "smooth" });
    }, [activeOption])

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown" && activeOption !== (payload.result!.length - 1)) {
            setActiveOption((prev) => prev + 1);
        }
        if (e.key === "Enter") choseOption(activeOption)
    }

    const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowUp" && activeOption !== 0) {
            setActiveOption((prev) => prev - 1);
        }
    }

    useEffect(() => { props?.setIsValid && props.setIsValid(Boolean(props.id)); }, [props.id])

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
                value={search}
                error={props.required ? (props.id.length ? undefined : "please select user") : undefined}
                onChange={(e) => setSearch(e.target.value)}
                label={props.label}
            />

            <datalist
                className={`${isOpen && payload.result && payload.result.length ? "block" : "none"} absolute w-full shadow-lg z-40 max-h-40 top-[100%] bg-white dark:bg-black no-scrollbar border rounded-md border-t-0 p-2 overflow-y-scroll`}>
                {payload.isLoading ? <CircleProgress size="md" /> : payload.result !== null && payload.result.map((option, index) => (
                    <div
                        key={index}
                        id={`option-${index}`}
                        onClick={() => choseOption(index)}
                        className={`${index === activeOption ? "bg-slate-200 dark:bg-slate-800 font-extrabold" : "bg-white dark:bg-black"} flex flex-col w-full justify-center items-center rounded-md text-gray-600 dark:text-gray-300 p-1 mb-1 text-base cursor-pointer`}
                    >

                        <div className="flex flex-row w-full gap-4">
                            <img className="rounded-full flex shadow-md dark:shadow-secondary/40 w-10 h-10 object-contain" src={option.avatarUrl} alt={option.name} />
                            <p className="font-bold">{option.name}</p>
                        </div>
                        <p className="text-sm font-light -mt-2 -ml-8">{option.email}</p>
                    </div>
                ))}
            </datalist>
        </div>
    )
}

export default SelectUser;
