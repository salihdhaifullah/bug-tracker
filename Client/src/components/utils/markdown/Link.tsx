import { FaRightFromBracket, FaRightToBracket } from "react-icons/fa6";
import { setRange, useTextarea } from "./util";
import { useRef, useState } from "react";
import useOnClickOutside from "../../../utils/hooks/useOnClickOutside";
import { BiLink } from "react-icons/bi";

const EXTERNAL_LINK = "[](https://)";
const INTERNAL_LINK = "[](/)";

const Link = () => {
    const textarea = useTextarea();
    const headingRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useOnClickOutside(headingRef, () => { setIsOpen(false) });

    const insertLink = (isExternal: boolean) => {
        const start = textarea.selectionStart;
        setRange(textarea, start);
        document.execCommand("insertText", false, `${isExternal ? EXTERNAL_LINK : INTERNAL_LINK}`);
        setRange(textarea, start + 1);
    }

    return (
        <div ref={headingRef} title="Link" className="flex justify-center items-center">
            <BiLink onClick={() => setIsOpen(prev => !prev)} className="text-gray-700 dark:text-gray-300 dark:hover:bg-slate-800 hover:bg-slate-200 hover:text-primary dark:hover:text-secondary text-xl rounded-sm cursor-pointer" />

            <div className={`${isOpen ? "h-auto w-auto p-2 shadow-md" : ""} w-0 h-0 max-h-40 left-[30%] top-4 absolute transition-all ease-in-out bg-white dark:bg-black rounded-md`}>

                {isOpen && [true, false].map(
                    (linkType, index) => (
                        <p key={index}
                            title={linkType ? "external" : "internal"}
                            className="text-gray-700 dark:text-gray-300 dark:hover:bg-slate-800 hover:bg-slate-200 hover:text-primary dark:hover:text-secondary p-1 flex justify-center items-center rounded-sm cursor-pointer"
                            onClick={() => {
                                setIsOpen(false)
                                insertLink(linkType)
                            }}>

                            {linkType ? <FaRightFromBracket /> : <FaRightToBracket />}
                        </p>
                    )
                )}
            </div>
        </div>
    )
}


export default Link;
