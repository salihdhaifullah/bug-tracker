import { useRef, useState } from "react";
import { AiOutlineTable } from "react-icons/ai"
import NumberFiled from "../NumberFiled";
import { setRange, useTextarea } from "./util";
import useOnClickOutside from "../../../utils/hooks/useOnClickOutside";

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
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);
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
            <AiOutlineTable onClick={() => setIsOpen(true)} className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />

            <div
                className={`${isOpen ? "h-auto p-2 w-[160px]" : "hidden"}
                    gap-1 flex flex-col items-center justify-center left-[30%] top-4 absolute transition-all
                    ease-in-out bg-white rounded-md shadow-md`}>

                <div className="flex -gap-2 flex-col">
                    <NumberFiled value={rows} onChange={(e) => setRows(Number(e.target.value))} label="table rows" />
                    <NumberFiled value={cols} onChange={(e) => setCols(Number(e.target.value))} label="table columns" />
                </div>

                <button
                    onClick={() => {
                        insertTable();
                        setIsOpen(false);
                    }}
                    className="flex w-fit px-1 rounded-md hover:shadow-md bg-secondary text-primary text-base">add table</button>
            </div>
        </div>
    )
}

export default Table
