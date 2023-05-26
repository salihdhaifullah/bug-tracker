import { BsFileEarmarkImage } from "react-icons/bs";
import { toWEBPImage } from "../../../utils";
import { SetStateAction } from "react";

interface IImageProps {
    md: string;
    textarea: HTMLTextAreaElement
    repeatKeyHandler: (key: string) => boolean
    setMdAndSaveChanges: (md: string) => void
    setCursorTo: (position: SetStateAction<number>) => void
    files: Record<string, string>
}

const Image = (props: IImageProps) => {

    const image = async (file: File | null) => {
        if (file === null) return;
        props.repeatKeyHandler("");
        const preViewUrl = URL.createObjectURL(file);
        const base64 = await toWEBPImage(file);
        props.files[preViewUrl] = base64;

        props.setMdAndSaveChanges(`${props.md}\n![${file.name}](${preViewUrl})\n`);
        props.setCursorTo(props.md.length + 5 + file.name.length + preViewUrl.length);
    }

    return (
        <>
            <input type="file" id="image-input" className="hidden" accept="image/*" onChange={(e) => image(e?.target?.files ? e?.target?.files[0] : null)} />
            <label htmlFor="image-input">
                <div className="flex justify-center items-center">
                    <BsFileEarmarkImage className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
                </div>
            </label>
        </>
    )
}

export default Image;
