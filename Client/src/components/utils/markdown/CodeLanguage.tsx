import { BsFileEarmarkCode } from "react-icons/bs";
import programmingLanguages from "./programmingLanguages";
import { setRange, useTextarea } from "./util";
import { useRef, useState } from "react";
import useOnClickOutside from "../../../utils/hooks/useOnClickOutside";

const TRIPLE_BACK_TICK = "```";

const CodeLanguage = () => {
    const textarea = useTextarea();

    const codeLanguageRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useOnClickOutside(codeLanguageRef, () => { setIsOpen(false) });

    const insertCodeLanguage = (lang: string) => {
        const start = textarea.selectionStart;
        setRange(textarea, start);
        document.execCommand("insertText", false, `\n${TRIPLE_BACK_TICK}${lang}\n\n${TRIPLE_BACK_TICK}`);
        setRange(textarea, start + 5 + lang.length);
    }

    return (
        <div title="Code language" ref={codeLanguageRef} className="flex flex-row gap-2 items-center">
            <BsFileEarmarkCode onClick={() => setIsOpen(true)} className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />

            <div
                className={`${isOpen ? "h-auto w-auto shadow-md overflow-y-auto p-2" : ""} w-0 h-0 max-h-40 left-[30%] top-4 absolute transition-all ease-in-out bg-white rounded-md`}>
                {programmingLanguages.map((Lang, index) => (
                    <div
                        onClick={() => {
                            insertCodeLanguage(Lang.name)
                            setIsOpen(false)
                        }}
                        key={index}
                        className="text-gray-700 gap-1 text-base p-1 flex text-center items-center rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer">
                        <Lang.icon title={Lang.name} style={{ color: Lang.color }} />
                    </div>
                ))}
            </div>

        </div>
    )
}

export default CodeLanguage;

