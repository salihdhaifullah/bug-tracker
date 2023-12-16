import { DragEvent, useRef } from "react";
import { IItem } from ".";
import Draggable from "./Draggable";
import { Link } from "react-router-dom";
import labelsColors from "../../utils/labelsColors";

interface IDroppableProps {
    items: IItem[] | null;
    col: string;
    handelDrop: (index: number, col: string) => void;
}

const Droppable = (props: IDroppableProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const dragOverHandler = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };

    const dropHandler = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const itemIndex = Number(event.dataTransfer.getData("text/plain"));
        props.handelDrop(itemIndex, props.col)
    };

    return (
        <div className="flex flex-col min-h-screen h-auto rounded-md p-2 gap-2 w-60">
            <h2 className="text-xl font-bold text-center text-primary dark:text-secondary rounded-sm hover:bg-slate-200 dark:hover:bg-slate-800 w-full p-2">{props.col}</h2>
            <div ref={ref} onDragOver={dragOverHandler} onDrop={dropHandler} id={`droppable-${props.col}`} className="flex gap-2 justify-start flex-col flex-1">
                {props.items && props.items.map((item, index) => {
                    if (item.status === props.col) return (
                        <Draggable index={index} key={index}>
                            <div className="flex flex-col gap-2 w-full">

                                <Link className="link text-base" to={`/tickets/${item.id}`}>{item.name}</Link>

                                <div className="flex text-sm flex-row justify-start gap-1 flex-wrap">
                                    <span title="type" className={`rounded-sm font-bold border-black dark:border-white w-fit p-1 text-white dark:text-black ${(labelsColors.TYPE as any)[item.type]}`}>{item.type}</span>
                                    <span title="priority" className={`rounded-sm font-bold border-black dark:border-white w-fit p-1 text-white dark:text-black ${(labelsColors.PRIORITY as any)[item.priority]}`}>{item.priority}</span>
                                </div>

                            </div>
                        </Draggable>
                    )
                })}
            </div>
        </div>
    )
}


export default Droppable;
