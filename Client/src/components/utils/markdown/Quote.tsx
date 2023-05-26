import { SetStateAction } from "react";
import { BsQuote } from "react-icons/bs";

interface IQuoteProps {
    md: string;
    textarea: HTMLTextAreaElement
    repeatKeyHandler: (key: string) => boolean
    setMdAndSaveChanges: (md: string) => void
    setCursorTo: (position: SetStateAction<number>) => void
}

const Quote = (props: IQuoteProps) => {
    const quote = () => {
        if (props.repeatKeyHandler("quote")) return;
        props.setMdAndSaveChanges(`${props.md}> `);
        props.setCursorTo(props.md.length + 2)
    }


    return (
        <div className="flex justify-center items-center"
            onClick={() => quote()}>
            <BsQuote className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    )
}

export default Quote;
