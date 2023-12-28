import { DragEvent, ReactElement, useRef } from "react";

interface IDraggableProps {
    children: ReactElement[] | ReactElement | string;
    index: number;
    isReadOnly: boolean;
}

const Draggable = (props: IDraggableProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const dragStartHandler = (event: DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData("text/plain", event.currentTarget.id);
    };

    return (
        <div
            id={props.index.toString()}
            ref={ref}
            draggable={!props.isReadOnly}
            onDragStart={dragStartHandler}
        >
            <div
                className="static w-full flex justify-center items-center text-xl font-bold text-primary dark:text-secondary p-2 shadow-md dark:shadow-secondary/40 border bg-slate-50 dark:bg-slate-950">
                {" "} {props.children}
            </div>
        </div>
    );
}

export default Draggable;
