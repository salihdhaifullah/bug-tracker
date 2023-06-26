import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { Option } from ".";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import useFetchApi from "../../utils/hooks/useFetchApi";
import TextFiled from "../utils/TextFiled";
import CircleProgress from "../utils/CircleProgress";
import { useParams } from "react-router-dom";

interface ISelectToInventProps {
    setId: (value: string) => void;
    id: string;
}

const SelectToInvent = (props: ISelectToInventProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { projectId } = useParams();
    const [activeOption, setActiveOption] = useState(1);
    const [search, setSearch] = useState("");

    const [options, setOptions] = useState<Option[]>([]);

    const targetRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(targetRef, () => setIsOpen(false));

    const [payload, call] = useFetchApi<Option[]>("GET", `user/users-to-invent/${projectId}?email=${search}`, [search]);

    useEffect(() => { if (search.trim().length >= 1) call(); }, [search])

    useEffect(() => { if (payload.result) setOptions(payload.result); }, [payload.result])

    const choseOption = (optionIndex: number) => {
        props.setId(options[optionIndex].id)
        setSearch(options[optionIndex].email)
        setIsOpen(false);
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
                error={props.id.length === 26 ? undefined : "please select user to invent"}
                onChange={(e) => setSearch(e.target.value)}
                label="chose user to invent to this project"
            />

            <datalist
                className={`${isOpen && options.length ? "block" : "none"} absolute w-full shadow-lg z-40 max-h-40 top-[100%] bg-white no-scrollbar border rounded-md border-t-0 p-2 overflow-y-scroll`}>
                {payload.isLoading ? <CircleProgress size="md" /> : options.map((option, index) => (
                    <div
                        key={index}
                        id={`option-${index}`}
                        onClick={() => choseOption(index)}
                        className={`${index === activeOption ? "bg-slate-200 font-extrabold" : "bg-white"}  flex flex-col w-full justify-center items-center  bg-slate-200 rounded-md text-gray-600 p-1 mb-1 text-base cursor-pointer`}
                    >

                        <div className="flex flex-row w-full gap-4">
                            <img className="rounded-full flex shadow-md w-10 h-10 object-contain" src={option.imageUrl} alt={option.fullName} />
                            <p className="font-bold">{option.fullName}</p>
                        </div>
                        <p className="text-sm font-light -mt-2 -ml-8">{option.email}</p>
                    </div>
                ))}
            </datalist>
        </div>
    )
}

export default SelectToInvent;
