import { BiHeading } from "react-icons/bi";
import { findWordBoundaries, setRange, useTextarea } from "./util";
import { useRef, useState } from "react";
import useOnClickOutside from "../../../utils/hooks/useOnClickOutside";

const Heading = () => {
    const textarea = useTextarea();

    const headingRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useOnClickOutside(headingRef, () => { setIsOpen(false) });

    const insertHeading = (headingType: number) => {
        const text = textarea.value;
        let start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (start === end) start = findWordBoundaries(text, start).boundaryStart;

        setRange(textarea, start);
        document.execCommand("insertText", false, ` ${"#".repeat(headingType)} `);
        setRange(textarea, headingType + end + 3);
    };

    return (
        <div ref={headingRef} className="flex flex-row gap-2 items-center">
            <BiHeading onClick={() => setIsOpen(true)} className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />

            <div className={`${isOpen ? "h-auto w-auto p-2 shadow-md" : ""} w-0 h-0 max-h-40 left-[30%] top-4 absolute transition-all ease-in-out bg-white rounded-md`}>

                {["text-2xl", "text-xl", "text-lg", "text-base", "text-sm", "text-xs"].map(
                    (textType, index) => (
                        <p key={index}
                            className={`text-gray-700 p-1 flex justify-center items-center rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer ${textType} `}
                            onClick={() => {
                                setIsOpen(false)
                                insertHeading(index + 1)
                            }}>
                            <BiHeading />
                        </p>
                    )
                )}
            </div>
        </div>
    );
};

export default Heading;
