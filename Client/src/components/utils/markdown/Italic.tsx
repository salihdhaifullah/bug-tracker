import { SetStateAction } from "react";
import { BiItalic } from "react-icons/bi";

interface IItalicProps {
    md: string;
    textarea: HTMLTextAreaElement
    repeatKeyHandler: (key: string) => boolean
    setMdAndSaveChanges: (md: string) => void
    setCursorTo: (position: SetStateAction<number>) => void
}

const Italic = (props: IItalicProps) => {
    const italic = () => {
        if (props.repeatKeyHandler("italic")) return;
        props.setMdAndSaveChanges(`${props.md}__`);
        props.setCursorTo(props.md.length + 1)
    }

    return (
        <div className="flex justify-center items-center"
            onClick={() => italic()}>
            <BiItalic className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    )
}

export default Italic;
