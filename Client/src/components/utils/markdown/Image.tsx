import { BsFileEarmarkImage } from "react-icons/bs";
import { toWEBPImage } from "../../../utils";
import { setRange } from ".";
import { MutableRefObject } from "react";

interface IImageProps {
    textarea: HTMLTextAreaElement
    setMdAndSaveChanges: (md: string) => void
    files: MutableRefObject<{base64: string; previewUrl: string;}[]>
}


const Image = (props: IImageProps) => {

    const insertImage = async (file: File | null) => {
        if (file === null) return;

        const previewUrl = URL.createObjectURL(file);
        const base64 = await toWEBPImage(file);
        props.files.current.push({base64, previewUrl});


        let text = props.textarea.value;
        const start = props.textarea.selectionStart;
        const end = props.textarea.selectionEnd;

        const part1 = text.slice(0, start);
        const part2 = text.slice(end);

        const image = `\n![${file.name}](${previewUrl})\n`;

        text = `${part1}${image}${part2}`;

        props.textarea.value = text;
        props.setMdAndSaveChanges(text);

        setRange(props.textarea, start + 5 + file.name.length + previewUrl.length);
    }

    return (
        <>
            <input type="file" id="image-input" className="hidden" accept="image/*" onChange={(e) => insertImage(e?.target?.files ? e?.target?.files[0] : null)} />
            <label htmlFor="image-input">
                <div className="flex justify-center items-center">
                    <BsFileEarmarkImage className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
                </div>
            </label>
        </>
    )
}

export default Image;
