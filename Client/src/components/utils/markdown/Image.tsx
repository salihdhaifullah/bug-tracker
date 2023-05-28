import { BsFileEarmarkImage } from "react-icons/bs";
import { toWEBPImage } from "../../../utils";
import { setRange } from ".";

interface IImageProps {
    textarea: HTMLTextAreaElement
    setMdAndSaveChanges: (md: string) => void
    files: {base64: string, preViewUrl: string}[]
}


const Image = (props: IImageProps) => {

    const insertImage = async (file: File | null) => {
        if (file === null) return;

        const preViewUrl = URL.createObjectURL(file);
        const base64 = await toWEBPImage(file);
        props.files.push({base64, preViewUrl});


        let text = props.textarea.value;
        const start = props.textarea.selectionStart;
        const end = props.textarea.selectionEnd;

        const part1 = text.slice(0, start);
        const part2 = text.slice(end);

        const image = `\n![${file.name}](${preViewUrl})\n`;

        text = `${part1}${image}${part2}`;

        props.textarea.value = text;
        props.setMdAndSaveChanges(text);

        const range = start + 5 + file.name.length + preViewUrl.length;

        setRange(props.textarea, range, range);
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
