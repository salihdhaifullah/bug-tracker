import { ReactElement, createContext, useContext } from "react";

const NEWLINE = "\n";
const SPACE = " ";

export const findWordBoundaries = (text: string, index: number): { boundaryStart: number, boundaryEnd: number } => {
    let boundaryStart = index;
    let boundaryEnd = index;

    while (boundaryStart > 0) {
        const char = text[boundaryStart - 1];
        if (char === SPACE || char === NEWLINE) break;
        boundaryStart--;
    }

    while (boundaryEnd < text.length) {
        const char = text[boundaryEnd];
        if (char === SPACE || char === NEWLINE) break;
        boundaryEnd++;
    }

    return { boundaryStart, boundaryEnd };
};

export const getCurrentLine = (start: number, text: string): string => {
    const currentLines = text.slice(0, start).split("\n");
    return currentLines[currentLines.length - 1]?.trim() || "";
}

export const setRange = (input: HTMLTextAreaElement, start: number, end?: number) => {
    input.setSelectionRange(start, end ? end : start);
    input.focus();
}

const TextareaContext = createContext<HTMLTextAreaElement | null>(null);

export const useTextarea = () => {
    return useContext(TextareaContext)!;
}

export const TextareaProvider = ({ children, textarea }: { children: ReactElement[], textarea: HTMLTextAreaElement }) => {
    return (
        <TextareaContext.Provider value={textarea}>
            {children}
        </TextareaContext.Provider>
    );
}
