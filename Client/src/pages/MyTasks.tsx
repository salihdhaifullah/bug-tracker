import { useEffect, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent, useRef, useState, ReactElement, MutableRefObject } from "react"

interface IDraggableProps {
    children: ReactElement[] | ReactElement | string;
    Dragged: MutableRefObject<number | null>;
    index: number;
}

interface IItem {
    data: string;
    row: number;
}

interface IDroppableProps {
    items: IItem[];
    row: number;
    Dragged: MutableRefObject<number | null>;
}

const Droppable = (props: IDroppableProps) => {
    return (
        <div id={`droppable-${props.row}`} className="flex flex-col min-h-80 h-auto bg-white rounded-md p-2 shadow-md gap-2 border border-primary w-full">
            <h2 className="text-2xl font-bold text-center text-secondary">row-{props.row}</h2>
            <div className="flex gap-2 flex-col w-full h-full">
                {props.items.map((item, index) => {
                    if (item.row === props.row) return (
                        <Draggable Dragged={props.Dragged} index={index} key={index}>
                            <p>{item.data}</p>
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
    const Dragged = useRef<number | null>(null);
    const [data, setData] = useState<IItem[]>([
        { row: 1, data: "item-1" },
        { row: 1, data: "item-2" },
        { row: 1, data: "item-3" },
        { row: 1, data: "item-4" },
        { row: 2, data: "item-5" },
        { row: 2, data: "item-6" },
        { row: 1, data: "item-7" }
    ]);

    const getElementId = (ele: Element | null): number | null => {
        if (ele === null || ele.id === "root") return null;
        if (ele.id.startsWith("droppable-")) return Number(ele.id.split("-")[1]);
        return getElementId(ele.parentElement);
    }

    const handelDrop = (x: number, y: number) => {
        const element = document.elementFromPoint(x, y);
        const id = getElementId(element);
        if (id === null || Dragged.current === null || ![1, 2, 3].includes(id)) return;
        if (![1, 2, 3].includes(id)) return;
        const dataCopy = Array.from(data);
        dataCopy[Dragged.current].row = id;
        setData(dataCopy);
    }

    const handelMouseUp = (e: MouseEvent) => {
        handelDrop(e.screenX, e.screenY/2);
    }

    const handelTouchEnd = (e: TouchEvent) => {
        console.log(e)
        handelDrop(e.changedTouches[0].screenX, e.changedTouches[0].screenY/2);
    }

    useEffect(() => {
        window.addEventListener("mouseup", handelMouseUp, { capture: true });
        window.addEventListener("touchend", handelTouchEnd, { capture: true });
        return () => {
            window.removeEventListener("mouseup", handelMouseUp, { capture: true });
            window.removeEventListener("touchend", handelTouchEnd, { capture: true });
        }
        }, [])

    return (
        <div className="flex prevent-select py-10 my-10 flex-row justify-between bg-white shadow-md p-4 gap-4">
            <Droppable Dragged={Dragged} items={data} row={1} />
            <Droppable Dragged={Dragged} items={data} row={2} />
            <Droppable Dragged={Dragged} items={data} row={3} />
        </div>
    )
}

export default MyTasks;
