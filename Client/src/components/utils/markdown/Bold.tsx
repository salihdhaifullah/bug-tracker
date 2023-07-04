import { BiBold } from "react-icons/bi";
import { findWordBoundaries, setRange, useTextarea } from "./util";

const DOUBLE_ASTERISK = "**";

const Bold = () => {
  const textarea = useTextarea();

  const insertBold = () => {
    const text = textarea.value;
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;

    if (start === end) {
      const {boundaryStart, boundaryEnd} = findWordBoundaries(text, start);
      start = boundaryStart;
      end = boundaryEnd + 2;
    }

    setRange(textarea, start);
    document.execCommand("insertText", false, DOUBLE_ASTERISK);
    setRange(textarea, end);
    document.execCommand("insertText", false, DOUBLE_ASTERISK);

    setRange(textarea, end);
  };

  return (
    <div className="flex justify-center items-center" onClick={() => insertBold()}>
      <BiBold className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
    </div>
  );
};

export default Bold;
