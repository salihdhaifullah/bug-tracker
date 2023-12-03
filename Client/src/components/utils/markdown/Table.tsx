import { useRef, useState } from "react";
import { AiOutlineTable } from "react-icons/ai"
import NumberFiled from "../NumberFiled";
import { setRange, useTextarea } from "./util";
import useOnClickOutside from "../../../utils/hooks/useOnClickOutside";
import Button from "../Button";

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

const Table = () => {
    const [rows, setRows] = useState(0);
    const [cols, setCols] = useState(0);
    const textarea = useTextarea();

    const tableRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useOnClickOutside(tableRef, () => { setIsOpen(false) });

    const insertTable = () => {
        const table = makeTable(rows, cols);

        const start = textarea.selectionStart;
        setRange(textarea, start);
        document.execCommand("insertText", false, `\n${table}\n`);
        setRange(textarea, start + 2 + table.length);
    }

    return (
        <div title="Table" ref={tableRef} className="flex flex-row gap-2 items-center">
            <AiOutlineTable onClick={() => setIsOpen(true)} className="text-gray-700 dark:text-gray-300 dark:hover:bg-slate-800 hover:bg-slate-200 hover:text-primary dark:hover:text-secondary text-xl p-0.5 rounded-sm cursor-pointer" />

            <div
                className={`${isOpen ? "h-auto p-2 w-[160px]" : "hidden"}
                    gap-1 flex flex-col items-center justify-center left-[30%] top-4 absolute transition-all
                    ease-in-out bg-white dark:bg-black rounded-md shadow-md dark:shadow-secondary/40`}>

                <div className="flex gap-2 w-full h-full flex-col my-2">
                    <NumberFiled value={rows} onChange={(e) => setRows(Number(e.target.value))} label="table rows" />
                    <NumberFiled value={cols} onChange={(e) => setCols(Number(e.target.value))} label="table columns" />
                </div>

                <Button
                    onClick={() => {
                        insertTable();
                        setIsOpen(false);
                    }}
                >add table</Button>
            </div>
        </div>
    )
}

export default Table
