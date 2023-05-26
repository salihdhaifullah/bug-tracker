import { BiHeading } from "react-icons/bi";
import { setRange } from ".";

interface IHeadingProps {
    textarea: HTMLTextAreaElement
    setMdAndSaveChanges: (md: string) => void
}

const Heading = (props: IHeadingProps) => {
    const insertHeading = (headingType: number) => {
        let text = props.textarea.value;
        const start = props.textarea.selectionStart;

        let boundaryStart = start - 1;
        if (text[boundaryStart] && text[boundaryStart].trim() && text[boundaryStart] !== "\n") {
            while (boundaryStart > 0) {
                const char = text[boundaryStart];
                if (char === " " || !char) break;
                boundaryStart--;
            }
        } else boundaryStart = start;


        let boundaryEnd = start + 1;
        if (text[boundaryEnd] && text[boundaryEnd].trim() && text[boundaryEnd] !== "\n") {
            while (boundaryEnd < text.length) {
                const char = text[boundaryEnd];
                if (char === " " || !char) break;
                boundaryEnd++;
            }
        }

        const part1 = text.substring(0, boundaryStart);
        const part2 = text.substring(boundaryStart);

        text = part1 + ('#'.repeat(headingType) + " ") + part2;

        props.setMdAndSaveChanges(text);
        setRange(props.textarea, boundaryEnd, null);
    }

    return (
        <div className="flex group flex-row gap-2 items-center relative">
            <BiHeading className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />

            <div className="group-hover:h-auto group-hover:w-auto w-0 h-0 max-h-40 -left-8 top-4 absolute transition-all ease-in-out bg-white group-hover:p-2 rounded-md group-hover:shadow-md">
                {["text-2xl", "text-xl", "text-lg", "text-base", "text-sm", "text-xs"].map((textType, index) => (
                    <p
                        key={index}
                        className={`text-gray-700 p-1 flex justify-center items-center rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer ${textType} `}
                        onClick={() => insertHeading((index + 1))}>
                        <BiHeading />
                    </p>
                ))}

            </div>
        </div>
    )
}


export default Heading;
