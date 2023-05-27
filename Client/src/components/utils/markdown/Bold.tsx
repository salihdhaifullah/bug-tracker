import { BiBold } from "react-icons/bi";
import { setRange } from ".";

// constants for symbols and characters
const ASTERISK = "*";
const DOUBLE_ASTERISK = "**";
const SPACE = " ";
const NEWLINE = "\n";

interface IBoldProps {
  textarea: HTMLTextAreaElement;
  setMdAndSaveChanges: (md: string) => void;
}

const Bold = (props: IBoldProps) => {
  // helper function to check if a string is wrapped with asterisks
  const isWrappedWithAsterisks = (str: string) => {
    return str.startsWith(DOUBLE_ASTERISK) && str.endsWith(DOUBLE_ASTERISK);
  };

  // helper function to find the boundaries of a word in a text
  const findWordBoundaries = (text: string, index: number) => {
    let boundaryStart = index === 0 ? 0 : index - 1;
    let boundaryEnd = index + 1;

    // find the left boundary by moving backwards until a space or newline is encountered
    while (boundaryStart >= 0) {
      const char = text[boundaryStart];
      if (char === SPACE || char === NEWLINE || !char) break;
      boundaryStart--;
    }

    // find the right boundary by moving forward until a space or newline is encountered
    while (boundaryEnd < text.length) {
      const char = text[boundaryEnd];
      if (char === SPACE || char === NEWLINE || !char) break;
      boundaryEnd++;
    }

    return { boundaryStart, boundaryEnd };
  };

  // function to insert bold formatting to the selected text or word
  const insertBold = () => {
    let text = props.textarea.value;
    const start = props.textarea.selectionStart;
    const end = props.textarea.selectionEnd;

    // this means we have a selected text
    if (start !== end) {
      // get the parts of the text before and after the selection
      const part1 = text.slice(0, start);
      const part2 = text.slice(end);
      // get the selected text
      const selectedText = text.slice(start, end);

      let isUndo = true;
      // if ends and starts with ** remove it
      if (isWrappedWithAsterisks(selectedText)) {
        // remove the asterisks from the selected text
        text = `${part1}${selectedText.slice(2, -2)}${part2}`;
      } else if (
        // check if the surrounding characters are asterisks
        text[start - 1] === ASTERISK &&
        text[start - 2] === ASTERISK &&
        text[end] === ASTERISK &&
        text[end + 1] === ASTERISK
      ) {
        // remove the surrounding asterisks
        text = `${part1.slice(0, -2)}${selectedText}${part2.slice(2)}`;
      } else {
        isUndo = false;
        // add asterisks to the selected text
        text = `${part1}${DOUBLE_ASTERISK}${selectedText}${DOUBLE_ASTERISK}${part2}`;
      }

      props.textarea.value = text;
      props.setMdAndSaveChanges(text);

      const rangeStart = isUndo ? start - 2 : start + 2;
      const rangeEnd = isUndo ? end - 2 : end + 2;

      setRange(props.textarea, rangeStart, rangeEnd);
    } else {
      // no text is selected, so find the word at the cursor position
      let word = "";

      // find the boundaries of the word
      const { boundaryStart, boundaryEnd } = findWordBoundaries(text, start);

      // get the word from the boundaries
      word = text.slice(boundaryStart + 1, boundaryEnd);

      let newWord = word;
      let isUndo = false;
      if (isWrappedWithAsterisks(newWord)) {
        // remove the asterisks from the word
        newWord = newWord.slice(2, -2);
        isUndo = true;
      } else {
        // add asterisks to the word
        newWord = `${DOUBLE_ASTERISK}${newWord}${DOUBLE_ASTERISK}`;
      }

      // get the parts of the text before and after the word
      let part1 = text.slice(0, boundaryStart + 1);
      let part2 = text.slice(boundaryEnd);

      // replace the word with the new word in the text
      text = `${part1}${newWord}${part2}`;

      props.textarea.value = text;
      props.setMdAndSaveChanges(text);

      const rangeStart = isUndo ? part1.length : part1.length + 2;
      const rangeEnd =
        isUndo ? part1.length + newWord.length : part1.length + newWord.length - 2;

      setRange(props.textarea, rangeStart, rangeEnd);
    }
  };

  return (
    <div className="flex justify-center items-center" onClick={() => insertBold()}>
      <BiBold className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
    </div>
  );
};

export default Bold;
