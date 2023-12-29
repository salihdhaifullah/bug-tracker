import { FaStrikethrough } from "react-icons/fa";
import { findWordBoundaries, setRange, useTextarea } from "./util";

const TILDE = "~";

const StrikeThrough = () => {
  const textarea = useTextarea();

  const insertStrikeThrough = () => {
    const text = textarea.value;
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;

    if (start === end) {
      const { boundaryStart, boundaryEnd } = findWordBoundaries(text, start);
      start = boundaryStart;
      end = boundaryEnd;
    }

    end++

    setRange(textarea, start);
    document.execCommand("insertText", false, TILDE);
    setRange(textarea, end);
    document.execCommand("insertText", false, TILDE);

    setRange(textarea, end);
  };

  return (
    <div title="strike through" className="flex justify-center items-center" onClick={() => insertStrikeThrough()}>
      <FaStrikethrough className="text-gray-700 dark:text-gray-300 dark:hover:bg-slate-800 hover:bg-slate-200 hover:text-primary dark:hover:text-secondary text-xl p-0.5 rounded-sm cursor-pointer" />
    </div>
  );
};

export default StrikeThrough;
