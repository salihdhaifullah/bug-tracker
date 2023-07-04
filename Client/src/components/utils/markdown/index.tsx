import { useState, useCallback, MutableRefObject } from "react";
import Heading from "./Heading";
import Bold from "./Bold";
import Italic from "./Italic";
import CodeBlock from "./CodeBlock";
import BlockQuote from "./BlockQuote";
import Link from "./Link";
import CodeLanguage from "./CodeLanguage";
import Image from "./Image";
import UnOrderedList from "./UnOrderedList";
import OrderedList from "./OrderedList";
import Parser from "./Parser";
import Table from "./Table";
import LineBreak from "./LineBreak";
import { TextareaProvider } from "./util";
import "highlight.js/styles/atom-one-dark.css";
import Button from "../Button";

interface IEditorProps {
    md: string;
    files: MutableRefObject<{ base64: string, previewUrl: string }[]>;
    setMd: (md: string) => void;
    onSubmit?: () => void;
    onCancel?: () => void;
}

const Editor = ({ md, setMd, files, onSubmit, onCancel }: IEditorProps) => {
    const [isPreview, setIsPreview] = useState(false);
    const [textarea, setTextarea] = useState<HTMLTextAreaElement | null>(null);

    const textareaCallback = useCallback((element: HTMLTextAreaElement | null) => { setTextarea(element) }, [])

    return (
        <div className="flex flex-col w-full h-auto border-gray-700 justify-center items-center ">
            <div className="flex flex-col w-full border-gray-700 bg-white p-2 rounded-md">
                <div className="inline-flex w-full justify-between">

                    <div className="flex gap-2 mb-2 mr-8">
                        <Button onClick={() => setIsPreview(!isPreview)}>{isPreview ? "write" : "preview"}</Button>
                    </div>

                    <div className="flex h-auto max-w-[250px] w-fit overflow-hidden items-center relative">
                        <div className="flex flex-row gap-2 w-full thin-scrollbar overflow-x-auto overflow-y-hidden items-center">
                            {textarea === null ? null : (
                                <TextareaProvider textarea={textarea}>
                                    <Heading />
                                    <Bold />
                                    <Italic />
                                    <CodeBlock />
                                    <BlockQuote />
                                    <Link />
                                    <CodeLanguage />
                                    <Image files={files} />
                                    <Table />
                                    <LineBreak />
                                    <UnOrderedList />
                                    <OrderedList />
                                </TextareaProvider>
                            )}
                        </div>
                    </div>
                </div>

                {isPreview ? (
                    <div className="markdown flex flex-col flex-1 flex-grow w-full h-full" dangerouslySetInnerHTML={{ __html: Parser(md) }}></div>
                ) : (
                    <div className="inline-flex w-full">
                        <textarea
                            value={md}
                            onChange={(e) => setMd(e.target.value)}
                            ref={textareaCallback}
                            className="border h-auto flex flex-1 flex-grow outline-secondary border-secondary p-2 rounded-md w-full min-h-[20vh]"></textarea>
                    </div>
                )}

                <div className="justify-end mt-2 gap-2 inline-flex w-full">
                    {!onSubmit || isPreview ? null : <Button onClick={onSubmit}>submit</Button>}
                    {!onCancel ? null : <Button onClick={onCancel}>cancel</Button>}
                </div>

            </div>
        </div>
    )
}

export default Editor;
