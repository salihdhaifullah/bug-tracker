import { ChangeEvent, useEffect, useRef, useState, KeyboardEvent } from "react";
import { mdParser, toWEBPImage } from "../../utils";
import { BiHeading, BiBold, BiLink, BiItalic, BiCodeAlt, BiListUl, BiListOl } from "react-icons/bi";
import { BsFileEarmarkCode, BsFileEarmarkImage, BsQuote } from "react-icons/bs";
import "highlight.js/styles/base16/railscasts.css";

// "monokai-sublime"

function setCursorPosition(input: HTMLTextAreaElement, positionStart: number, positionEnd?: number) {
    input.setSelectionRange(positionStart, positionEnd || positionStart);
    input.focus();
}

type headingType = 1 | 2 | 3 | 4 | 5 | 6;

const Editor = () => {
    const [isPreview, setIsPreview] = useState(false);
    const [md, setMd] = useState("");
    const [lastKey, setLastKey] = useState("");
    const [cursorTo, setCursorTo] = useState(0);
    const [selectionTo, setSelectionTo] = useState<{ start: number, end: number } | null>(null);
    const { current: changes } = useRef<string[]>([""]);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const { current: filesRef } = useRef<Record<string, string> | null>(null);
    const [isUnOrderedList, setIsUnOrderedList] = useState(false);
    const [isOrderedList, setIsOrderedList] = useState(false);

    useEffect(() => {
        setCursorPosition(textareaRef?.current!, cursorTo)
    }, [cursorTo])

    useEffect(() => {
        if (selectionTo) setCursorPosition(textareaRef?.current!, selectionTo.start, selectionTo.end)
    }, [selectionTo])

    const handelChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMd(e.target.value);
        setLastKey("");
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        console.log(changes)

        if (e.ctrlKey && e.key === "z" && changes.length >= 2) {
            changes.pop();
            setMd(changes[changes.length - 1])
        }

        if (e.key === " " && !textareaRef?.current?.value.endsWith("  ")) {
            changes.push(textareaRef?.current?.value!);
        }

        if (e.key === "Tab") {
            e.preventDefault()
            const start = textareaRef?.current?.selectionStart as number;
            setMd(`${md.slice(0, start)}\t${md.slice(start)}`);
        }

        if (e.key === "Enter" && lastKey !== "unOrderedList") {
            setIsUnOrderedList(false)
        }

        if (e.key === "Enter" && lastKey === "unOrderedList") {
            const text = `${md}\n- `;
            setMd(text);
            setCursorTo(text.length)
            setIsUnOrderedList(true)
        }
    }

    const heading = (headingType: headingType) => {
        if (lastKey === "heading") {
            changes.pop();
            setMd(changes[changes.length - 1])
            setLastKey("");
            return;
        }

        setLastKey("heading");

        let text = md;
        const start = textareaRef?.current?.selectionStart as number;
        const isEmpty = !text.slice(start).trim().length;

        if (text.length >= start && !isEmpty) {
            const length = text.length - start;
            let textToWrap = new Uint8Array(length);
            let textToWrapIndex = 0;

            for (let i = start; i < text.length; i++) {
                textToWrap[textToWrapIndex] = text.charCodeAt(i);
                textToWrapIndex++;
            }

            text = `${text.slice(0, start)}\n${'#'.repeat(headingType)} ${new TextDecoder().decode(textToWrap)}`;
        } else if (isEmpty) {
            text = `${'#'.repeat(headingType)} `;
        } else {
            text = `${text}\n${'#'.repeat(headingType)} `;
        }

        setMd(text);
        changes.push(textareaRef?.current?.value!);
        setCursorTo(text.length + 1);
    }

    const bold = () => {
        if (lastKey === "bold") {
            changes.pop();
            setMd(changes[changes.length - 1])
            setLastKey("");
            return;
        }

        setLastKey("bold");

        let text = md;
        const start = textareaRef?.current?.selectionStart as number;
        const currentLines = text.slice(0, start).split("\n") as string[];
        const currentLine = currentLines[currentLines.length - 1];

        const isCurrentLineEmpty = !currentLine.trim().length;
        const isAfterCurrentLineEmpty = !text.slice(start).trim().length;

        if (isAfterCurrentLineEmpty) {
            text = `${currentLines.join("\n")}****`;
            setMd(text);
            setCursorTo(text.length - 2)
        } else {
            text = `${currentLines.join("\n")}****`;
            setMd(text);
            setCursorTo(text.length - 2)
        }

        changes.push(textareaRef?.current?.value!);
    }

    const link = () => {
        if (lastKey === "link") {
            changes.pop();
            setMd(changes[changes.length - 1])
            setLastKey("");
            return;
        }

        setLastKey("link");

        const text = `${md}[title](link)`;
        setMd(text);
        setSelectionTo({ start: text.length - 5, end: text.length - 1 });
    }

    const italic = () => {
        if (lastKey === "italic") {
            changes.pop();
            setMd(changes[changes.length - 1])
            setLastKey("");
            return;
        }

        setLastKey("italic");

        const text = `${md}__`;
        setMd(text);
        setCursorTo(text.length - 1)
    }

    const codeBLock = () => {
        if (lastKey === "codeBLock") {
            changes.pop();
            setMd(changes[changes.length - 1])
            setLastKey("");
            return;
        }

        setLastKey("codeBLock");

        const text = `${md}\`\``;
        setMd(text);
        setCursorTo(text.length - 1)
    }

    const quote = () => {
        if (lastKey === "quote") {
            changes.pop();
            setMd(changes[changes.length - 1])
            setLastKey("");
            return;
        }

        setLastKey("quote");

        const text = `${md}> `;
        setMd(text);
        setCursorTo(text.length)
    }

    const codeLang = (lang: string) => {
        if (lastKey === "codeLang") {
            changes.pop();
            setMd(changes[changes.length - 1])
            setLastKey("");
            return;
        }

        setLastKey("codeLang");

        const text = `${md}\n\`\`\`${lang}\n\n\`\`\``;
        setMd(text);
        setCursorTo(text.length - 4)
    }

    const imageAdd = async (file: File | null) => {
        if (file === null) return;

        const preViewUrl = URL.createObjectURL(file);
        const base64 = await toWEBPImage(file);
        if (filesRef) filesRef[preViewUrl] = base64;

        console.log(filesRef);

        const text = `${md}\n![${file.name}](${preViewUrl})\n`;
        setMd(text);
        setCursorPosition(textareaRef?.current!, text.length);
    }

    const image = () => {
        if (lastKey === "image") {
            changes.pop();
            setMd(changes[changes.length - 1])
            setLastKey("");
            return;
        }

        setLastKey("image");
    }

    const unOrderedList = () => {

        if (lastKey === "unOrderedList" && isUnOrderedList) {
            const text = `${md}\n- `;
            setMd(text);
            setCursorTo(text.length)
            return;
        }

        if (lastKey === "unOrderedList") {
            changes.pop();
            setMd(changes[changes.length - 1])
            setLastKey("");
            return;
        }

        setLastKey("unOrderedList");

        const text = `${md}\n- `;
        setMd(text);
        setCursorTo(text.length)
        setIsUnOrderedList(true)
    }

    const orderedList = () => {

        if (lastKey === "isOrderedList" && isOrderedList) {
            const text = `${md}\n1. `;
            setMd(text);
            setCursorTo(text.length)
            return;
        }

        if (lastKey === "isOrderedList") {
            changes.pop();
            setMd(changes[changes.length - 1])
            setLastKey("");
            return;
        }

        setLastKey("isOrderedList");

        const text = `${md}\n1. `;
        setMd(text);
        setCursorTo(text.length)
        setIsUnOrderedList(true)
    }

    return (
        <div className="m-4 flex flex-col flex-grow w-auto border-gray-700 justify-center items-center ">
            <div className="flex flex-col w-full border-gray-700 bg-white p-2 shadow-lg rounded-md">
                <div className="inline-flex w-full justify-between">
                    <div className="flex flex-row gap-2 mb-2">
                        <button onClick={() => setIsPreview(false)} className="border border-gray-800 p-2 rounded-md">Write</button>
                        <button onClick={() => setIsPreview(true)} className="border border-gray-800 p-2 rounded-md">Preview</button>
                    </div>
                    <div className="flex flex-row gap-2 items-center">

                        <div className="flex group flex-row gap-2 items-center relative">
                            <BiHeading className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />

                            <div className="group-hover:h-auto group-hover:w-auto w-0 h-0 max-h-40 -left-8 top-4 absolute transition-all ease-in-out bg-white group-hover:p-2 rounded-md group-hover:shadow-md">
                                {["text-2xl", "text-xl", "text-lg", "text-base", "text-sm", "text-xs"].map((textType, index) => (
                                    <p
                                        key={index}
                                        className={`text-gray-700 p-1 flex justify-center items-center rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer ${textType} `}
                                        onClick={() => heading((index + 1) as headingType)}>
                                        <BiHeading />
                                    </p>
                                ))}

                            </div>
                        </div>

                        <div className="flex justify-center items-center"
                            onClick={() => bold()}>
                            <BiBold className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
                        </div>

                        <div className="flex justify-center items-center"
                            onClick={() => link()}>
                            <BiLink className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
                        </div>

                        <div className="flex justify-center items-center"
                            onClick={() => italic()}>
                            <BiItalic className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
                        </div>

                        <div className="flex justify-center items-center"
                            onClick={() => codeBLock()}>
                            <BiCodeAlt className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
                        </div>


                        <div className="flex group flex-row  gap-2 items-center relative">
                            <BsFileEarmarkCode className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />

                            <div
                                className="group-hover:h-auto group-hover:w-auto w-0 h-0 max-h-40 group-hover:overflow-y-auto -left-8 top-4 absolute transition-all ease-in-out bg-white group-hover:p-2 rounded-md group-hover:shadow-md">
                                {languesList.map((lang, index) => (
                                    <p
                                        key={index}
                                        className="text-gray-700 text-[0px] group-hover:text-base group-hover:p-1 flex text-center items-center rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer"
                                        onClick={() => codeLang(lang)}>
                                        {lang}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <input type="file" id="image-input" className="hidden" accept="image/*" onChange={(e) => imageAdd(e?.target?.files ? e?.target?.files[0] : null)} />
                        <label htmlFor="image-input">
                            <div className="flex justify-center items-center"
                                onClick={() => image()}>
                                <BsFileEarmarkImage className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
                            </div>
                        </label>

                        <div className="flex justify-center items-center"
                            onClick={() => quote()}>
                            <BsQuote className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
                        </div>

                        <div className="flex justify-center items-center"
                            onClick={() => unOrderedList()}>
                            <BiListUl className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
                        </div>

                        <div className="flex justify-center items-center"
                            onClick={() => orderedList()}>
                            <BiListOl className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
                        </div>

                    </div>
                </div>

                {isPreview ? (
                    <div className="markdown" dangerouslySetInnerHTML={{ __html: mdParser(md) }}></div>
                ) : (
                    <div className="inline-flex w-full">
                        <textarea
                            onKeyDown={handleKeyDown}
                            value={md}
                            onChange={handelChange}
                            ref={textareaRef}
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


const languesList = ["apache", "bash", "c", "cpp", "elixir", "ruby", "excel", "fsharp", "go", "gradle", "graphql", "haskell", "http", "java", "julia", "javascript", "json", "kotlin", "less", "llvm", "makefile", "mathematica", "matlab", "perl", "objectivec", "nginx", "php", "html", "plaintext", "powershell", "properties", "python", "rust", "scala", "scss", "shell", "sql", "swift", "yaml", "typescript", "vim", "x86asm", "clojure", "coffeescript", "csharp", "markdown", "dart", "delphi", "dockerfile", "xml"];
