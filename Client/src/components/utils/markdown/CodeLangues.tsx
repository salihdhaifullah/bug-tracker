import { BsFileEarmarkCode } from "react-icons/bs";
import programmingLangues from "./ProgrammingLangues";
import { setRange } from ".";

interface ICodeLanguesProps {
    textarea: HTMLTextAreaElement
    setMdAndSaveChanges: (md: string) => void
}

const TRIPLE_BACK_TICK = "```";
const LINE = "\n";

const CodeLangues = (props: ICodeLanguesProps) => {
    const insertCodeLangues = (lang: string) => {
        let text = props.textarea.value;
        const start = props.textarea.selectionStart;
        const end = props.textarea.selectionEnd;

        const part1 = text.slice(0, start);
        const part2 = text.slice(end);

        text = `${part1}${LINE}${TRIPLE_BACK_TICK}${lang}${LINE}${LINE}${TRIPLE_BACK_TICK}${part2}`;

        props.textarea.value = text;
        props.setMdAndSaveChanges(text);

        setRange(props.textarea, start + 5 + lang.length);

        props.setMdAndSaveChanges(`${props.textarea.value}`);
    }

    return (
        <div className="flex group flex-row  gap-2 items-center relative">
            <BsFileEarmarkCode className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />

            <div className="group-hover:h-auto group-hover:w-auto w-0 h-0 max-h-40 group-hover:overflow-y-auto -left-8 top-4 absolute transition-all ease-in-out bg-white group-hover:p-2 rounded-md group-hover:shadow-md">
                {programmingLangues.map((lang, index) => (
                    <div onClick={() => insertCodeLangues(lang.name)} key={index} className="text-gray-700 gap-1 text-[0px] group-hover:text-base group-hover:p-1 flex text-center items-center rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer">
                        <lang.icon title={lang.name}  style={{color: lang.color}}/>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default CodeLangues;

