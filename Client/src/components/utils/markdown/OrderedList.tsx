import { SetStateAction, useState } from "react";
import { BiListOl } from "react-icons/bi";

interface IOrderedListProps {
    md: string;
    textarea: HTMLTextAreaElement
    repeatKeyHandler: (key: string) => boolean
    setMdAndSaveChanges: (md: string) => void
    setCursorTo: (position: SetStateAction<number>) => void
}

const OrderedList = (props: IOrderedListProps) => {
    const [counter, setCounter] = useState(1);

    const orderedList = () => {
        if (props.repeatKeyHandler("orderedList")) return;
        props.setMdAndSaveChanges(`${props.md}\n${counter}. `);
        props.setCursorTo(props.md.length + 2 + counter.toString().length)
        setCounter((prev) => (prev + 1))
    }

    return (
        <div className="flex justify-center items-center"
            onClick={() => orderedList()}>
            <BiListOl className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    )
}


export default OrderedList;
