import { BiListUl } from "react-icons/bi";
import { useCallback, useEffect, useRef } from "react";
import { setRange, useTextarea } from "./util";

const UnOrderedList = () => {
    let isUnOrderedListMode = useRef(false);

    const textarea = useTextarea();

    const resetState = () => {
        isUnOrderedListMode.current = false;
    }

    const addItem = () => {
        const text = textarea.value;
        const start = textarea.selectionStart;
        const currentLine = text.slice(0, start).split("\n").at(-1)!.trim();

        if (currentLine.split(".")[0][0] !== "-" && isUnOrderedListMode.current) resetState();

        const inner = `${currentLine.length === 0 ? "" : "\n"}- `;

        setRange(textarea, start);
        document.execCommand("insertText", false, inner);
        setRange(textarea, start + inner.length);

        isUnOrderedListMode.current = true;
    };


    const enterUnOrderedListMode = () => {
        addItem();
    }

    const undo = () => {
        const start = textarea.selectionStart;
        setRange(textarea, start);
        document.execCommand("undo");
    }

    const keydownListener = useCallback((e: KeyboardEvent) => {
        if (e.key !== "Enter" || !isUnOrderedListMode.current) return;

        e.preventDefault();
        const text = textarea.value;
        const start = textarea.selectionStart;
        const currentLine = text.slice(0, start).split("\n").at(-1)!.trim();

        if (!currentLine.startsWith("-")) {
            resetState();
            undo();
            return;
        }

        if (currentLine.length > 1) addItem();
        else {
            resetState();
            undo();
        }
    }, []);

    useEffect(() => {
        textarea.addEventListener("keydown", keydownListener);
        return () => textarea.removeEventListener("keydown", keydownListener);
    }, []);

    return (
        <div title="Unordered list" className="flex justify-center items-center" onClick={() => enterUnOrderedListMode()}>
            <BiListUl className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    );
};

export default UnOrderedList;
