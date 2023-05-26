import { SetStateAction, useState } from "react";
import { BiBold } from "react-icons/bi";

interface IBoldProps {
    md: string;
    textarea: HTMLTextAreaElement
    repeatKeyHandler: (key: string) => boolean
    setMdAndSaveChanges: (md: string) => void
    setCursorTo: (position: SetStateAction<number>) => void
}

const Bold = (props: IBoldProps) => {
    const isBold = (text: string, start: number) => {
        const lineStart = text.lastIndexOf("\n", start - 1) + 1;
        let lineEnd = text.lastIndexOf("\n", start);

        if (lineEnd === -1) {
            lineEnd = text.length;
        }

        const lineText = text.substring(lineStart, lineEnd);
        const boldPattern = /^\*\*.*\*\*$/;
        return boldPattern.test(lineText);
    }

    const insertMarkdown = (before: string, after: string) => {
        const start = props.textarea.selectionStart;
        const end = props.textarea.selectionEnd;
        const text = props.md.substring(start, end);

        if (isBold(text, start)) {
            props.textarea.setRangeText(text.substring(2, text.length - 2), start, end, "select")
        } else {
            props.textarea.setRangeText("**" + text + "**", start, end, "select")
            props.textarea.selectionStart = start + before.length;
            props.textarea.selectionEnd = end + before.length;
            props.textarea.focus()
        }

        // const newText = before + text + after;
        // props.textarea.setRangeText(newText);

    }

    const bold = () => {
        // if (props.repeatKeyHandler("bold")) return;
        insertMarkdown("**", "**");

        // let text = props.md;
        // const start = props.textarea.selectionStart;
        // let currentLines = text.slice(0, start).split("\n");
        // const afterCurrentLines = text.slice(start).split("\n");
        // const currentLine = currentLines[currentLines.length - 1];

        // let currentLineTrimmed = currentLine.trim();

        // if (currentLineTrimmed.length && currentLineTrimmed.endsWith("**") && currentLineTrimmed.startsWith("**")) {
        //     const undoValue = currentLineTrimmed.substring(2, currentLineTrimmed.length - 2);
        //     text = `${currentLines.slice(0, currentLines.length - 1)}${undoValue}${afterCurrentLines.join("\n")}`;
        // }
        // else if (currentLineTrimmed.length === 0) {
        //     text = `${text.substring(0, start)}****${text.substring(start)}`;
        // } else {
        //     text = `${currentLines.slice(0, currentLines.length - 1)}**${currentLine}**${afterCurrentLines.join("\n")}`;
        // }

        // props.setMdAndSaveChanges(text);
        // props.setCursorTo(start - 2)
    }

    return (
        <div className="flex justify-center items-center"
            onClick={() => bold()}>
            <BiBold className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    )
}

export default Bold
