import { SetStateAction } from "react";
import { BiListUl } from "react-icons/bi";

interface IUnOrderedListProps {
    md: string;
    textarea: HTMLTextAreaElement
    repeatKeyHandler: (key: string) => boolean
    setMdAndSaveChanges: (md: string) => void
    setCursorTo: (position: SetStateAction<number>) => void
}

const UnOrderedList = (props: IUnOrderedListProps) => {
    const unOrderedList = () => {
        if (props.repeatKeyHandler("unOrderedList")) return;
        props.setMdAndSaveChanges(`${props.md}\n- `);
        props.setCursorTo(props.md.length + 2)
    }

    return (
        <div className="flex justify-center items-center"
            onClick={() => unOrderedList()}>
            <BiListUl className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    )
}


export default UnOrderedList;
