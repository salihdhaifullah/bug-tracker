import { useRef, useState, KeyboardEvent, useCallback } from "react";
import Heading from "./Heading";
import Bold from "./Bold";
import Italic from "./Italic";
import CodeBlock from "./CodeBlock";
import BlockQuote from "./BlockQuote";
import Link from "./Link";
import CodeLangues from "./CodeLangues";
import Image from "./Image";
import UnOrderedList from "./UnOrderedList";
import OrderedList from "./OrderedList";
import Parser from "./Parser";
import "highlight.js/styles/atom-one-dark.css";
import Stack from "../../../utils/Stack";

export function setRange(input: HTMLTextAreaElement, start: number, end?: number) {
    input.setSelectionRange(start, end ? end : start);
    input.focus();
}

const Editor = () => {
    const [isPreview, setIsPreview] = useState(false);
    const [md, setMd] = useState("");
    const [textarea, setTextarea] = useState<HTMLTextAreaElement | null>(null);

    let files = useRef<{ base64: string, preViewUrl: string }[]>([]);

    let undoStack = useRef<Stack<string>>(new Stack<string>());
    let redoStack = useRef<Stack<string>>(new Stack<string>());

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.ctrlKey && e.key === "z") {
            if (!undoStack.current.isEmpty()) {
                const lastChange = undoStack.current.pop() as string;
                redoStack.current.push(md);
                setMd(lastChange);
            }
        }
        else if (e.ctrlKey && e.key === "y") {
            if (!redoStack.current.isEmpty()) {
                const lastChange = redoStack.current.pop() as string;
                undoStack.current.push(md);
                setMd(lastChange);
            }
        }
        else {
            if (e.key === " ") undoStack.current.push(md);
        }
    }

    const setMdAndSaveChanges = (md: string) => {
        setMd(md);
        undoStack.current.push(md);
    }

    const textareaCallback = useCallback((element: HTMLTextAreaElement | null) => { setTextarea(element) }, [])

    return (
        <div className="m-4 flex flex-col flex-grow w-auto border-gray-700 justify-center items-center ">
            <div className="flex flex-col w-full border-gray-700 bg-white p-2 shadow-lg rounded-md">
                <div className="inline-flex w-full justify-between">
                    <div className="flex flex-row gap-2 mb-2">
                        <button onClick={() => setIsPreview(false)} className="border border-gray-800 p-2 rounded-md">Write</button>
                        <button onClick={() => setIsPreview(true)} className="border border-gray-800 p-2 rounded-md">Preview</button>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        {textarea === null ? null : (
                            <>
                                <Heading setMdAndSaveChanges={setMdAndSaveChanges} textarea={textarea} />
                                <Bold setMdAndSaveChanges={setMdAndSaveChanges} textarea={textarea} />
                                <Italic setMdAndSaveChanges={setMdAndSaveChanges} textarea={textarea} />
                                <CodeBlock setMdAndSaveChanges={setMdAndSaveChanges} textarea={textarea} />
                                <BlockQuote setMdAndSaveChanges={setMdAndSaveChanges} textarea={textarea} />
                                <Link setMdAndSaveChanges={setMdAndSaveChanges} textarea={textarea} />
                                <CodeLangues setMdAndSaveChanges={setMdAndSaveChanges} textarea={textarea} />
                                <Image setMdAndSaveChanges={setMdAndSaveChanges} textarea={textarea} files={files} />
                                <UnOrderedList setMdAndSaveChanges={setMdAndSaveChanges} textarea={textarea} />
                                <OrderedList setMdAndSaveChanges={setMdAndSaveChanges} textarea={textarea} />
                            </>
                        )}
                    </div>
                </div>

                {isPreview ? (
                    <div className="markdown" dangerouslySetInnerHTML={{ __html: Parser(md) }}></div>
                ) : (
                    <div className="inline-flex w-full">
                        <textarea
                            onKeyDown={handleKeyDown}
                            value={md}
                            onChange={(e) => setMd(e.target.value)}
                            ref={textareaCallback}
                            className="flex border outline-secondary border-secondary p-2 rounded-md w-full min-h-[5rem]"></textarea>
                    </div>
                )}

                <div className="justify-end inline-flex w-full">
                    <button>button</button>
                </div>
            </div>
        </div>
    )
}

export default Editor;
