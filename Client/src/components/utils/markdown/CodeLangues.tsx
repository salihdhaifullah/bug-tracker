import { SetStateAction } from "react";
import { BsFileEarmarkCode } from "react-icons/bs";

interface ICodeLanguesProps {
    md: string;
    textarea: HTMLTextAreaElement
    repeatKeyHandler: (key: string) => boolean
    setMdAndSaveChanges: (md: string) => void
    setCursorTo: (position: SetStateAction<number>) => void
}

const CodeLangues = (props: ICodeLanguesProps) => {
    const languesList = ["apache", "bash", "c", "cpp", "elixir", "ruby", "excel", "fsharp", "go", "gradle", "graphql", "haskell", "http", "java", "julia", "javascript", "json", "kotlin", "less", "llvm", "makefile", "mathematica", "matlab", "perl", "objectivec", "nginx", "php", "html", "plaintext", "powershell", "properties", "python", "rust", "scala", "scss", "shell", "sql", "swift", "yaml", "typescript", "vim", "x86asm", "clojure", "coffeescript", "csharp", "markdown", "dart", "delphi", "dockerfile", "xml"];

    const codeLangues = (lang: string) => {
        if (props.repeatKeyHandler("codeLangues")) return;
        props.setMdAndSaveChanges(`${props.md}\n\`\`\`${lang}\n\n\`\`\``);
        props.setCursorTo(props.md.length + 6 + lang.length)
    }

    return (
        <div className="flex group flex-row  gap-2 items-center relative">
            <BsFileEarmarkCode className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />

            <div
                className="group-hover:h-auto group-hover:w-auto w-0 h-0 max-h-40 group-hover:overflow-y-auto -left-8 top-4 absolute transition-all ease-in-out bg-white group-hover:p-2 rounded-md group-hover:shadow-md">
                {languesList.map((lang, index) => (
                    <p
                        key={index}
                        className="text-gray-700 text-[0px] group-hover:text-base group-hover:p-1 flex text-center items-center rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer"
                        onClick={() => codeLangues(lang)}>
                        {lang}
                    </p>
                ))}
            </div>
        </div>
    )
}

export default CodeLangues;
