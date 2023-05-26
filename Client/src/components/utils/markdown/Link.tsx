import { BiLink } from "react-icons/bi";

interface ILinkProps {
    md: string;
    textarea: HTMLTextAreaElement
    repeatKeyHandler: (key: string) => boolean
    setMdAndSaveChanges: (md: string) => void
    setSelectionTo: (position: { start: number; end: number; }) => void
}

const Link = (props: ILinkProps) => {

    const link = () => {
        if (props.repeatKeyHandler("link")) return;
        props.setMdAndSaveChanges(`${props.md}[text](link)`);
        props.setSelectionTo({ start: (props.md.length + 7), end: (props.md.length + 11) });
    }

    return (
        <div className="flex justify-center items-center"
            onClick={() => link()}>
            <BiLink className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    )
}


export default Link;
