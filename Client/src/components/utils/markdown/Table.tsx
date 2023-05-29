import { useState } from "react";
import { AiOutlineTable } from "react-icons/ai"
import NumberFiled from "../NumberFiled";
import { setRange } from ".";

interface ITableProps {
    textarea: HTMLTextAreaElement
    setMdAndSaveChanges: (md: string) => void
}


const makeTable = (rows: number, cols: number) => {
    let result = "";

    for (let i = 1; i <= cols; i++) result += `col${i} | `;

    result = result.slice(0, -2);
    result += "\n";

    for (let i = 1; i <= cols; i++) result += "--- | ";

    result = result.slice(0, -2);
    result += "\n";

    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= cols; j++) result += `row${i} | `;

        result = result.slice(0, -2);

        if (i < rows) result += "\n";
    }

    return result;
};

const Table = (props: ITableProps) => {
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);

    const insertTable = () => {
        const table = makeTable(rows, cols);

        let text = props.textarea.value;
        const start = props.textarea.selectionStart;
        const end = props.textarea.selectionEnd;

        const part1 = text.slice(0, start);
        const part2 = text.slice(end);

        text = `${part1}\n${table}\n${part2}`;

        props.textarea.value = text;
        props.setMdAndSaveChanges(text);

        setRange(props.textarea, start + 2 + table.length);
    }

    return (
        <div className="flex group flex-row gap-2 items-center relative">
            <AiOutlineTable className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />

            <div className="group-hover:h-auto group-hover:w-[160px] gap-1 flex flex-col items-center justify-center w-0 h-0 -left-12 top-4 absolute transition-all ease-in-out bg-white group-hover:p-2 rounded-md shadow-md">
                <div className="hidden group-hover:flex -gap-2 flex-col">
                    <NumberFiled value={rows} onChange={(e) => setRows(Number(e.target.value))} label="table rows" />
                    <NumberFiled value={cols} onChange={(e) => setCols(Number(e.target.value))} label="table columns" />
                </div>
                <button onClick={() => insertTable()} className="hidden group-hover:flex w-fit px-1 rounded-md hover:shadow-md bg-secondary text-primary text-base">add table</button>
            </div>
        </div>
    )
}

export default Table
