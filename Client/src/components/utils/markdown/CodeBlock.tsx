import { SetStateAction } from "react";
import { BiCodeAlt } from "react-icons/bi";

interface ICodeBlockProps {
    md: string;
    textarea: HTMLTextAreaElement
    repeatKeyHandler: (key: string) => boolean
    setMdAndSaveChanges: (md: string) => void
    setCursorTo: (position: SetStateAction<number>) => void
}

const CodeBlock = (props: ICodeBlockProps) => {

    const codeBLock = () => {
        if (props.repeatKeyHandler("codeBlock")) return;
        props.setMdAndSaveChanges(`${props.md}\`\``);
        props.setCursorTo(props.md.length + 1)
    }

    return (
        <div className="flex justify-center items-center"
            onClick={() => codeBLock()}>
            <BiCodeAlt className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    )
}

export default CodeBlock;
