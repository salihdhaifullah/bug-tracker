import { BsFileEarmarkImage } from "react-icons/bs";
import toWEBPImage from "../../../utils/toWEBPImage";
import { MutableRefObject } from "react";
import { setRange, useTextarea } from "./util";

interface IImageProps {
    files: MutableRefObject<{base64: string; previewUrl: string;}[]>
}


const Image = (props: IImageProps) => {
    const textarea = useTextarea();

    const insertImage = async (file: File | null) => {
        if (file === null) return;

        // because react markdown validate the urls
        const previewUrl = `/${URL.createObjectURL(file)}`;
        const base64 = await toWEBPImage(file);
        props.files.current.push({base64, previewUrl});

        const start = textarea.selectionStart;
        setRange(textarea, start);
        document.execCommand("insertText", false, `\n![${file.name}](${previewUrl})\n`);

        setRange(textarea, start + 5 + file.name.length + previewUrl.length);
    }

    return (
        <>
            <input type="file" id="image-input" className="hidden" accept="image/*" onChange={(e) => insertImage(e?.target?.files ? e?.target?.files[0] : null)} />
            <label htmlFor="image-input" title="Image">
                <div className="flex justify-center items-center">
                    <BsFileEarmarkImage className="text-gray-700 dark:text-gray-300 dark:hover:bg-slate-800 hover:bg-slate-200 hover:text-primary dark:hover:text-secondary text-xl p-0.5 rounded-sm cursor-pointer" />
                </div>
            </label>
        </>
    )
}

export default Image;
