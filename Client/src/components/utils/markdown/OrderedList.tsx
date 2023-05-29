import { BiListOl } from "react-icons/bi";
import { useCallback, useEffect, useRef } from "react";
import { setRange } from ".";

interface IOrderedListProps {
    textarea: HTMLTextAreaElement;
    setMdAndSaveChanges: (md: string) => void;
}

const OrderedList = (props: IOrderedListProps) => {
    let isOrderedListMode = useRef(false);
    let orderedListCount = useRef(1);

    const resetState = () => {
        isOrderedListMode.current = false;
        orderedListCount.current = 1;
    }

    const addItem = () => {
        let text = props.textarea.value;
        const start = props.textarea.selectionStart;
        const end = props.textarea.selectionEnd;
        const inner = `${orderedListCount.current}. `;
        text = `${text.slice(0, start)}${inner}${text.slice(end)}`;
        props.textarea.value = text;
        props.setMdAndSaveChanges(text);

        setRange(props.textarea, start + inner.length);
        orderedListCount.current++;
    };


    const enterOrderedListMode = () => {
        isOrderedListMode.current = true;
        addItem();
    }

    const keydownListener = useCallback((e: KeyboardEvent) => {
        if (e.key !== "Enter" || !isOrderedListMode.current) return;

        e.preventDefault();
        let text = props.textarea.value;
        const start = props.textarea.selectionStart;
        const end = props.textarea.selectionEnd;
        const currentLines = text.slice(0, start).split("\n");
        const currentLine = currentLines[currentLines.length - 1];
        const part2 = text.slice(end);

        const currentLineParts = currentLine.trim().split(".");

        if (currentLineParts[0].match(/\d/) && currentLineParts[1] && currentLineParts[1].length > 0) {
            const slicedText = currentLines.slice(0, currentLines.length).join("\n");
            const inner = (slicedText.trim().length ? "\n" : "") + orderedListCount.current + ". ";
            text = `${slicedText}${inner}${part2}`;
            props.textarea.value = text;
            props.setMdAndSaveChanges(text);

            setRange(props.textarea,  start + inner.length);
            orderedListCount.current++;
        }
        else if (currentLineParts[0].match(/\d/)) {
            resetState();
            const slicedText = currentLines.slice(0, currentLines.length - 1).join("\n");
            const inner = slicedText.trim().length ? "\n" : "";
            text = `${slicedText}${inner}${part2}`;
            props.textarea.value = text;
            props.setMdAndSaveChanges(text);
            setRange(props.textarea, start - currentLine.length);
        }
    }, []);


    useEffect(() => {
        props.textarea.addEventListener("keydown", keydownListener);
        return () => props.textarea.removeEventListener("keydown", keydownListener);
    }, []);

    return (
        <div className="flex justify-center items-center" onClick={() => enterOrderedListMode()}>
            <BiListOl className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    );
};

export default OrderedList;
