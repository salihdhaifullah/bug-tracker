import { useEffect, useRef, useState, ReactElement, DragEvent, useMemo } from "react"
import useFetchApi from "../utils/hooks/useFetchApi";
import { Priority, Status, Type } from "../types";
import CircleProgress from "../components/utils/CircleProgress";

interface IDraggableProps {
    children: ReactElement[] | ReactElement | string;
    index: number;
}

interface IItem {
    name: string;
    id: string;
    priority: Priority;
    status: Status;
    type: Type;
}

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
        <div className="flex flex-col min-h-screen h-auto bg-white rounded-md p-2 shadow-md gap-2 border border-primary w-60">
            <h2 className="text-2xl font-bold text-center text-secondary">{props.col}</h2>
            <div ref={ref} onDragOver={dragOverHandler} onDrop={dropHandler} id={`droppable-${props.col}`} className="flex gap-2 justify-start flex-col flex-1">
                {props.items && props.items.map((item, index) => {
                    if (item.status === props.col) return (
                        <Draggable index={index} key={index}>
                            <div className="flex flex-col text-xs w-full">
                                <p>{item.priority}</p>
                                <p>{item.status}</p>
                                <p>{item.name}</p>
                                <p>{item.type}</p>
                                <p>{item.id}</p>
                            </div>
                        </Draggable>
                    )
                })}
            </div>
        </div>
    )
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
            draggable={true}
            onDragStart={dragStartHandler}
        >
            <div
                className="static w-full flex justify-center items-center text-xl font-bold text-primary p-2 shadow-md border bg-slate-50">
                {" "} {props.children}
            </div>
        </div>
    );
}

const MyTasks = () => {
    const [data, setData] = useState<IItem[]>([])

    const [_, callUpdate] = useFetchApi<unknown, { id: string, status: Status }>("PATCH", "ticket/status", [])
    const [tasksPayload, callTasks] = useFetchApi<IItem[], unknown>("GET", "ticket/my-tickets", [], (result) => { setData(result) })

    useEffect(() => { callTasks() }, [])

    const realScreenHeightOffset = useMemo(() => window.screen.height*0.3, [window.screen.height]);
    const realScreenHeightScroll = useMemo(() => window.screen.height*0.01, [window.screen.height]);

    const DragOverListener = (e: globalThis.DragEvent) => {
        if ((e.screenY + realScreenHeightOffset) >= window.screen.height) window.scrollBy(0, realScreenHeightScroll+((e.screenY + realScreenHeightOffset) - window.screen.height));
        if ((e.screenY - realScreenHeightOffset) <= 0) window.scrollBy(0, -realScreenHeightScroll+(e.screenY - realScreenHeightOffset));
    }

    useEffect(() => {
        document.addEventListener("drag", DragOverListener);
        return () => document.removeEventListener("drag", DragOverListener)
    }, [])

    const getElementId = (ele: Element | null): string | null => {
        if (ele === null || ele.id === "root") return null;
        if (ele.id.startsWith("droppable-")) return ele.id.split("-")[1];
        return getElementId(ele.parentElement);
    }

    const handelDrop = (index: number, col: string) => {
        if (!(col in Status)) return;
        if (data[index].status === col) return;
        const dataCopy = Array.from(data);

        callUpdate({ id: dataCopy[index].id, status: col as Status })
        dataCopy[index].status = col as Status;
        setData(dataCopy);
    }

    return (
        <div className="py-10 my-10 flex flex-wrap min-w-[100vw] flex-row justify-center items-start bg-white shadow-md p-2 gap-2">
            {!tasksPayload.isLoading && data.length ? (
                <>
                    <Droppable handelDrop={handelDrop} items={data} col={Status.review} />
                    <Droppable handelDrop={handelDrop} items={data} col={Status.active} />
                    <Droppable handelDrop={handelDrop} items={data} col={Status.in_progress} />
                    <Droppable handelDrop={handelDrop} items={data} col={Status.resolved} />
                    <Droppable handelDrop={handelDrop} items={data} col={Status.closed} />
                </>
            ) : (
                <CircleProgress size="md" />
            )}
        </div>
    )
}

export default MyTasks;
