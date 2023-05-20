import { SetStateAction, useEffect, useRef, useState } from "react";
import MdEditor from 'react-markdown-editor-lite';
import { toWEBPImage, mdParser } from "../../utils";
import 'react-markdown-editor-lite/lib/index.css';



interface IMarkdownEditorProps {
    setMd: (md: SetStateAction<string>) => void;
    setFiles: (files: SetStateAction<Record<string, Blob | null>>) => void
}

const MarkdownEditor = (props: IMarkdownEditorProps) => {
    const onImageUpload = async (file: File) => {
        const preViewUrl = URL.createObjectURL(file);
        const blob = await toWEBPImage(file);
        props.setFiles(prevFiles => ({ ...prevFiles, [preViewUrl]: blob }));
        return preViewUrl;
      }

    return (
       <MdEditor
          style={{ height: '500px' }}
          renderHTML={text => mdParser(text)}
          onChange={({ text }: { text: string }) => props.setMd(text)}
          onImageUpload={onImageUpload}
        />
    )
}

export default MarkdownEditor
