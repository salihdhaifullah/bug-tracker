import { useCallback, useEffect, useState } from "react";
import { BiListOl } from "react-icons/bi";

interface IOrderedListProps {
    textarea: HTMLTextAreaElement
    setMdAndSaveChanges: (md: string) => void
}

const OrderedList = (props: IOrderedListProps) => {
    const [isOrderedList, setIsOrderedList] = useState(false);
    const [enterCount, setEnterCount] = useState(0);

    const keydownListener =  useCallback((e: KeyboardEvent) => {
        if (e.key === "Enter") setEnterCount((prev) => prev + 1);
        else setEnterCount(0);
    }, [])

    useEffect(() => {
        if (isOrderedList) props.textarea.addEventListener("keydown", keydownListener);
        else props.textarea.removeEventListener("keydown", keydownListener);

        return () => props.textarea.removeEventListener("keydown", keydownListener);
    }, [isOrderedList])

    useEffect(() => {
        if (enterCount === 2) {
            setIsOrderedList(false);
            setEnterCount(0);
        }
    }, [enterCount]);

    const insertOrderedList = () => {
        setIsOrderedList(true);
    }

    useEffect(() => { console.table({ enterCount, isOrderedList }) }, [isOrderedList, enterCount])

    return (
        <div className="flex justify-center items-center"
            onClick={() => insertOrderedList()}>
            <BiListOl className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    )
}


export default OrderedList;
