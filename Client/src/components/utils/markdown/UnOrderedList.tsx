import { BiListUl } from "react-icons/bi";
import { useCallback, useEffect, useRef } from "react";
import { setRange } from ".";

interface IUnOrderedListProps {
    textarea: HTMLTextAreaElement;
    setMdAndSaveChanges: (md: string) => void;
}

const UnOrderedList = (props: IUnOrderedListProps) => {
    let isUnOrderedListMode = useRef(false);

    const insertDash = () => {
        let text = props.textarea.value;
        const start = props.textarea.selectionStart;
        const end = props.textarea.selectionEnd;
        text = `${text.slice(0, start)}- ${text.slice(end)}`;
        props.textarea.value = text;
        props.setMdAndSaveChanges(text);
        setRange(props.textarea, start + 2);
    };


    const enterUnOrderedListMode = () => {
        isUnOrderedListMode.current = true;
        insertDash();
    }

    const keydownListener = useCallback((e: KeyboardEvent) => {
        if (e.key !== "Enter" || !isUnOrderedListMode.current) return;

        e.preventDefault();
        let text = props.textarea.value;
        const start = props.textarea.selectionStart;
        const end = props.textarea.selectionEnd;
        const currentLines = text.slice(0, start).split("\n");
        const currentLine = currentLines[currentLines.length - 1];
        const part2 = text.slice(end);

        if (currentLine.trim().startsWith("-") && currentLine.trim().length > 1) {
            const slicedText = currentLines.slice(0, currentLines.length).join("\n");
            const inner = slicedText.trim().length ? "\n- " : "- ";
            text = `${slicedText}${inner}${part2}`;
            props.textarea.value = text;
            props.setMdAndSaveChanges(text);
            setRange(props.textarea, start + inner.length);
        }
        else if (currentLine.trim().startsWith("-") && currentLine.trim() === "-") {
            isUnOrderedListMode.current = false;
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
        <div className="flex justify-center items-center" onClick={() => enterUnOrderedListMode()}>
            <BiListUl className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    );
};

export default UnOrderedList;
