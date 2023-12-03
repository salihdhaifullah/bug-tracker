import { findWordBoundaries, setRange, useTextarea } from "./util";
import { FaListUl } from "react-icons/fa";

const LIST = "* [ ] todo\n* [x] done";

const List = () => {
    const textarea = useTextarea();

    const insertList = () => {
        const text = textarea.value;
        let start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (start === end) start = findWordBoundaries(text, start).boundaryStart;

        setRange(textarea, start);
        document.execCommand("insertText", false, `${LIST} `);
        setRange(textarea, end + 6, end + 10);
    };

    return (
        <div title="todo list" className="flex justify-center items-center"
            onClick={() => insertList()}>
            <FaListUl className="text-gray-700 dark:text-gray-300 dark:hover:bg-slate-800 hover:bg-slate-200 hover:text-primary dark:hover:text-secondary text-xl p-0.5 rounded-sm cursor-pointer" />
        </div>
    )
}

export default List;
