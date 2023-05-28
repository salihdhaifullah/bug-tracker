import { BiListUl } from "react-icons/bi";
import { useCallback, useRef } from "react";
import { setRange } from ".";

interface IUnOrderedListProps {
    textarea: HTMLTextAreaElement;
    setMdAndSaveChanges: (md: string) => void;
}

const UnOrderedList = (props: IUnOrderedListProps) => {
    let { current: enterKeyCount } = useRef(0);
    let { current: isStartingListMode } = useRef(false);
    let { current: isUnOrderedListMode } = useRef(false);

    const insertDash = () => {
        let text = props.textarea.value;
        const start = props.textarea.selectionStart;
        const end = props.textarea.selectionEnd;

        const part1 = text.slice(0, start);
        const part2 = text.slice(end);

        text = `${part1}- ${part2}`;

        props.textarea.value = text;
        props.setMdAndSaveChanges(text);

        const range = start + 3;

        setRange(props.textarea, range, range);
    };

    const keydownListener = useCallback((e: KeyboardEvent) => {


        if (e.key === "Enter") {
            e.preventDefault();
            let text = props.textarea.value;
            const start = props.textarea.selectionStart;
            const end = props.textarea.selectionEnd;
            const currentLines = text.slice(0, start).split("\n");
            const currentLine = currentLines[currentLines.length - 1];
            const part2 = text.slice(end);

            console.error("currentLines", currentLines)
            console.error("currentLine", `"${currentLine}"`)

            if (currentLine.trim().startsWith("-")) {
                if (currentLine.trim().length > 1) {
                    const slicedText = currentLines.slice(0, currentLines.length).join("\n");
                    text = `${slicedText}${isStartingListMode ? "" : "\n"}${part2}`;
                    props.textarea.value = text;
                    props.setMdAndSaveChanges(text);
                    const range = start + 3;
                    setRange(props.textarea, range, range);
                    console.error("the one")
                } else {
                    const slicedText = currentLines.slice(0, currentLines.length - 1).join("\n");
                    text = `${slicedText}${part2}`;
                    props.textarea.value = text;
                    props.setMdAndSaveChanges(text);
                    const range = start + 3;
                    setRange(props.textarea, range, range);
                    console.error("the two")
                }
            }
            else isUnOrderedListMode = false;
        }

        if (e.key === "Enter" && !enterKeyCount && !isStartingListMode) {
            e.preventDefault();
            insertDash();
        }

        if (isStartingListMode) isStartingListMode = false;

        if (e.key === "Enter") enterKeyCount += 1;
        else enterKeyCount = 0;

        if (enterKeyCount === 2) {
            isUnOrderedListMode = false;
            enterKeyCount = 0;
        }



        if (!isUnOrderedListMode) props.textarea.removeEventListener("keydown", keydownListener);
    }, []);

    const enterUnOrderedListMode = () => {
        if (!isUnOrderedListMode) props.textarea.addEventListener("keydown", keydownListener);

        isUnOrderedListMode = true;
        isStartingListMode = true;
        insertDash();
    };

    return (
        <div className="flex justify-center items-center" onClick={() => enterUnOrderedListMode()}>
            <BiListUl className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    );
};

export default UnOrderedList;
