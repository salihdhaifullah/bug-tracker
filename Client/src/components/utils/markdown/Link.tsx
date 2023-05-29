import { BiLink } from "react-icons/bi";
import { setRange } from ".";

interface ILinkProps {
    textarea: HTMLTextAreaElement
    setMdAndSaveChanges: (md: string) => void
}

const LINK = "[](https://)";

const Link = (props: ILinkProps) => {

    const insertLink = () => {
        let text = props.textarea.value;
        const start = props.textarea.selectionStart;
        const end = props.textarea.selectionEnd;

        const part1 = text.slice(0, start);
        const part2 = text.slice(end);

        text = `${part1} ${LINK} ${part2}`;

        props.textarea.value = text;
        props.setMdAndSaveChanges(text);

        setRange(props.textarea, start + 2);
    }

    return (
        <div className="flex justify-center items-center"
            onClick={() => insertLink()}>
            <BiLink className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    )
}


export default Link;
