import { useEffect, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent, useRef, useState, ReactElement } from "react"

const Draggable = ({ children }: {children: ReactElement[] | ReactElement | string}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [xTranslate, setXTranslate] = useState(0);
    const [yTranslate, setYTranslate] = useState(0);
    const [initialMousePosition, setInitialMousePosition] = useState({x: 0, y: 0});
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
        <div style={{ position: "relative" }}>
            <div
                style={isDragging ? {
                    width: initialWidth.current + "px",
                    transform: `translate(${xTranslate}px,${yTranslate}px)`,
                    position: "absolute"
                } : undefined}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
                ref={(z) => initialWidth.current = z?.offsetWidth!}
                className={`${isDragging ? "cursor-grabbing absolute" : "transition-all cursor-grab"} static w-full flex justify-center items-center text-xl font-bold text-primary p-2 shadow-md border bg-slate-50`}>
                {" "} {children}
            </div>
        </div>
    );
}

const MyTasks = () => {
    const [data1, setData1] = useState(["item-1", "item-2", "item-3", "item-4", "item-5"]);
    const [data2, setData2] = useState(["item-6", "item-7"]);
    const [data3, setData3] = useState([]);

    return (
        <div className="flex  prevent-select flex-row justify-between bg-white shadow-md p-4 gap-4">
            <div className="flex flex-col bg-white rounded-md p-2 shadow-md gap-2 border border-primary w-full">
                <h2 className="text-2xl font-bold text-center text-secondary">row-1</h2>
                <div id="row-1" className="flex gap-2 flex-col w-full h-full" onMouseUp={console.log}>
                    {data1.map((item, index) => (
                        <Draggable key={index}>
                            <p>{item}</p>
                        </Draggable>
                    ))}
                </div>
            </div>

            <div className="flex flex-col bg-white rounded-md p-2 shadow-md gap-2 border border-primary w-full">
                <h2 className="text-2xl font-bold text-center text-secondary">row-2</h2>
                <div id="row-2" className="flex gap-2 flex-col w-full h-full" onMouseUp={console.log}>
                    {data2.map((item, index) => (
                        <Draggable key={index}>
                            <p>{item}</p>
                        </Draggable>
                    ))}
                </div>
            </div >

            <div className="flex flex-col bg-white rounded-md p-2 shadow-md gap-2 border border-primary w-full">
                <h2 className="text-2xl font-bold text-center text-secondary">row-3</h2>
                <div id="row-3" className="flex gap-2 flex-col w-full h-full" onMouseUp={console.log}>
                    {data3.map((item, index) => (
                        <Draggable key={index}>
                            <p>{item}</p>
                        </Draggable>
                    ))}
                </div>
            </div >

        </div >
    )
}

export default MyTasks;
