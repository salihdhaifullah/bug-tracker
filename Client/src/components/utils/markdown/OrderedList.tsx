import { BiListOl } from "react-icons/bi";
import { useCallback, useEffect, useRef } from "react";
import { getCurrentLine, setRange, useTextarea } from "./util";


const OrderedList = () => {
    let isOrderedListMode = useRef(false);
    let orderedListCount = useRef(1);
    const textarea = useTextarea();

    const resetState = () => {
        isOrderedListMode.current = false;
        orderedListCount.current = 1;
    }

    const addItem = () => {
        const text = textarea.value;
        const start = textarea.selectionStart;
        const currentLine = getCurrentLine(start, text);
        const char = Number(currentLine.split(".")[0][0]);

        if ((Number.isNaN(char) || !Number.isInteger(char)) && isOrderedListMode.current) resetState();

        const inner = `${currentLine.length === 0 ? "" : "\n"}${orderedListCount.current}. `;

        setRange(textarea, start);
        document.execCommand("insertText", false, inner);
        setRange(textarea, start + inner.length);

        orderedListCount.current++;
        isOrderedListMode.current = true;
    };


    const enterOrderedListMode = () => {
        addItem();
    }

    const undo = () => {
        const start = textarea.selectionStart;
        setRange(textarea, start);
        document.execCommand("undo");
    }

    const keydownListener = useCallback((e: KeyboardEvent) => {
        if (e.key !== "Enter" || !isOrderedListMode.current) return;

        e.preventDefault();
        const text = textarea.value;
        const start = textarea.selectionStart;
        const currentLineParts = getCurrentLine(start, text).split(".");

        const char = Number(currentLineParts[0][0]);

        if (Number.isNaN(char) || !Number.isInteger(char)) {
            resetState();
            undo();
            return;
        }

        if (currentLineParts[1] && currentLineParts[1].length > 0) {
            addItem();
        }
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
        <div title="Ordered list" className="flex justify-center items-center" onClick={() => enterOrderedListMode()}>
            <BiListOl className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    );
};

export default OrderedList;
