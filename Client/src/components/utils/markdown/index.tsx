import { useRef, useState, KeyboardEvent, useCallback } from "react";
import Parser from "./Parser";
import Heading from "./Heading";
// import Bold from "./Bold";
// import Italic from "./Italic";
// import CodeBlock from "./CodeBlock";
// import Quote from "./Quote";
// import Link from "./Link";
// import CodeLangues from "./CodeLangues";
// import Image from "./Image";
// import UnOrderedList from "./UnOrderedList";
// import OrderedList from "./OrderedList";
import "highlight.js/styles/androidstudio.css";

export type OnKeyDownCallBack = (e: KeyboardEvent<HTMLTextAreaElement>) => void;

export function setRange(input: HTMLTextAreaElement, start: number | null, end: number | null) {
    input.setSelectionRange(start, end);
    input.focus();
}

const Editor = () => {
    const [isPreview, setIsPreview] = useState(false);
    const [md, setMd] = useState("");
    const [textarea, setTextarea] = useState<HTMLTextAreaElement | null>(null);

    let { current: changes } = useRef<string[]>([""]);
    const [onKeyDownCallBacks, setOnKeyDownCallBacks] = useState<OnKeyDownCallBack[]>([]);

    // let { current: files } = useRef<Record<string, string>>({});

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.ctrlKey && e.key === "z" && changes.length > 1) {
            changes.pop();
            setMd(changes[changes.length - 1])
        }

        if (e.key === " " && md.endsWith(" ")) { changes.push(md) }
        for (let i = 0; i< onKeyDownCallBacks.length; i++) { onKeyDownCallBacks[i](e) }
    }

    const setMdAndSaveChanges = (md: string) => {
        setMd(md);
        changes.push(md);
    }

    const textareaCallback = useCallback((element: HTMLTextAreaElement | null) => { setTextarea(element) }, [])

    const registerCallback = useCallback((callback: OnKeyDownCallBack) => {
        setOnKeyDownCallBacks((prev) => {
            prev.push(callback);
            return prev;
        });
    }, [])

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
                                <Heading
                                    setMdAndSaveChanges={setMdAndSaveChanges}
                                    textarea={textarea}
                                />

                                {/* <Bold
                                    setMdAndSaveChanges={setMdAndSaveChanges}
                                    textarea={textarea}
                                />

                                <Italic
                                    setMdAndSaveChanges={setMdAndSaveChanges}
                                    textarea={textarea}
                                />

                                <CodeBlock
                                    setMdAndSaveChanges={setMdAndSaveChanges}
                                    textarea={textarea}
                                />

                                <Quote
                                    setMdAndSaveChanges={setMdAndSaveChanges}
                                    textarea={textarea}
                                />

                                <Link
                                    setMdAndSaveChanges={setMdAndSaveChanges}
                                    textarea={textarea}
                                />


                                <CodeLangues
                                    setMdAndSaveChanges={setMdAndSaveChanges}
                                    textarea={textarea}
                                />

                                <Image
                                    setMdAndSaveChanges={setMdAndSaveChanges}
                                    textarea={textarea}
                                    files={files}
                                />

                                <UnOrderedList
                                    setMdAndSaveChanges={setMdAndSaveChanges}
                                    textarea={textarea}
                                />

                                <OrderedList
                                    setMdAndSaveChanges={setMdAndSaveChanges}
                                    textarea={textarea}
                                /> */}
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
