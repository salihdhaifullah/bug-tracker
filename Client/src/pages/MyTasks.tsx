import { useEffect, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent, useRef, useState, ReactElement, MutableRefObject } from "react"
import useFetchApi from "../utils/hooks/useFetchApi";
import { Priority, Status, Type } from "../types";
import CircleProgress from "../components/utils/CircleProgress";

interface IDraggableProps {
    children: ReactElement[] | ReactElement | string;
    Dragged: MutableRefObject<number | null>;
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
    Dragged: MutableRefObject<number | null>;
}

const Droppable = (props: IDroppableProps) => {

    return (
        <div id={`droppable-${props.col}`} className="flex flex-col h-screen bg-white rounded-md p-2 shadow-md gap-2 border border-primary w-full">
            <h2 className="text-2xl font-bold text-center text-secondary">{props.col}</h2>
            <div className="flex gap-2 flex-col w-full h-full">
                {props.items && props.items.map((item, index) => {
                    if (item.status === props.col) return (
                        <Draggable Dragged={props.Dragged} index={index} key={index}>
                            <div className="flex flex-col text-xs ">
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
    const [isDragging, setIsDragging] = useState(false);
    const [xTranslate, setXTranslate] = useState(0);
    const [yTranslate, setYTranslate] = useState(0);
    const [initialMousePosition, setInitialMousePosition] = useState({ x: 0, y: 0 });
    const initialWidth = useRef<number>(0);

    const onMouseDown = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
        setInitialMousePosition({ x: e.clientX, y: e.clientY });
        setIsDragging(true);
    };

    const onTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
        setInitialMousePosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        setIsDragging(true);
    };

    const onMouseMove = (e: MouseEvent) => {
        setXTranslate(xTranslate + e.clientX - initialMousePosition.x);
        setYTranslate(yTranslate + e.clientY - initialMousePosition.y);
    };

    const onTouchMove = (e: TouchEvent) => {
        setXTranslate(xTranslate + e.touches[0].clientX - initialMousePosition.x);
        setYTranslate(yTranslate + e.touches[0].clientY - initialMousePosition.y);
    };

    useEffect(() => {
        if (isDragging) props.Dragged.current = props.index;
        else props.Dragged.current = null;
    }, [isDragging])

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("touchmove", onTouchMove);
        }
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("touchmove", onTouchMove);
        }
    }, [isDragging, initialMousePosition]);

    useEffect(() => {
        window.addEventListener("mouseup", () => setIsDragging(false));
        window.addEventListener("touchend", () => setIsDragging(false));
        return () => {
            window.removeEventListener("mouseup", () => setIsDragging(false));
            window.removeEventListener("touchend", () => setIsDragging(false));
        }
    }, []);

    useEffect(() => {
        setXTranslate(0);
        setYTranslate(0);
    }, [isDragging])

    return (
        <div className="relative">
            <div
                style={isDragging ? {
                    width: initialWidth.current + "px",
                    zIndex: 1000,
                    transform: `translate(${xTranslate}px,${yTranslate}px)`,
                    position: "absolute"
                } : undefined}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
                ref={(e) => initialWidth.current = e?.offsetWidth!}
                className={`${isDragging ? "cursor-grabbing absolute" : "transition-all cursor-grab"} static w-full flex justify-center items-center text-xl font-bold text-primary p-2 shadow-md border bg-slate-50`}>
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

    const Dragged = useRef<number | null>(null);

    const getElementId = (ele: Element | null): string | null => {
        if (ele === null || ele.id === "root") return null;
        if (ele.id.startsWith("droppable-")) return ele.id.split("-")[1];
        return getElementId(ele.parentElement);
    }

    const handelDrop = (x: number, y: number) => {
        const status = getElementId(document.elementFromPoint(x, y)) as Status;
        if (status === null || Dragged.current === null || !(status in Status)) return;
        if (data[Dragged.current].status === status) return;
        
        const dataCopy = Array.from(data);
        callUpdate({ id: dataCopy[Dragged.current].id, status })
        dataCopy[Dragged.current].status = status;
        setData(dataCopy);
    }

    const handelMouseUp = (e: MouseEvent) => {
        handelDrop(e.screenX, (e.screenY - 49) / 2);
    }

    const handelTouchEnd = (e: TouchEvent) => {
        handelDrop(e.changedTouches[0].screenX, (e.changedTouches[0].screenY - 49) / 2);
    }

    useEffect(() => {
        if (!data.length) return;
        window.addEventListener("mouseup", handelMouseUp, { capture: true });
        window.addEventListener("touchend", handelTouchEnd, { capture: true });
        return () => {
            window.removeEventListener("mouseup", handelMouseUp, { capture: true });
            window.removeEventListener("touchend", handelTouchEnd, { capture: true });
        }
    }, [data])

    return (
        <div className="flex prevent-select py-10 my-10 flex-row justify-between bg-white shadow-md p-4 gap-4">
            {!tasksPayload.isLoading && data.length ? (
                <>
                    <Droppable Dragged={Dragged} items={data} col={Status.review} />
                    <Droppable Dragged={Dragged} items={data} col={Status.active} />
                    <Droppable Dragged={Dragged} items={data} col={Status.in_progress} />
                    <Droppable Dragged={Dragged} items={data} col={Status.resolved} />
                    <Droppable Dragged={Dragged} items={data} col={Status.closed} />
                </>
            ) : (
                <CircleProgress size="md" />
            )}
        </div>
    )
}

export default MyTasks;
