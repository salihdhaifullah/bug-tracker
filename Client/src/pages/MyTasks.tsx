import { useEffect, useLayoutEffect, useState } from "react"

const X = ({ children }: any) => {
    const [isDragging, setIsDragging] = useState(false);
    const [xTranslate, setXTranslate] = useState(0);
    const [yTranslate, setYTranslate] = useState(0);
    const [initialMousePosition, setInitialMousePosition] = useState<any>({});

    const onMouseDown = ({ clientX, clientY }: any) => {
        setInitialMousePosition({ x: clientX, y: clientY });
        setIsDragging(true);
    };

    useLayoutEffect(() => {
        const onMouseMove = (e: any) => {
            setXTranslate(xTranslate + e.clientX - initialMousePosition.x);
            setYTranslate(yTranslate + e.clientY - initialMousePosition.y);
        };
        if (isDragging) {
            window.addEventListener("mousemove", onMouseMove);
        }
        return () => window.removeEventListener("mousemove", onMouseMove);
    }, [isDragging, initialMousePosition]);

    useEffect(() => {
        const onMouseUp = () => setIsDragging(false);
        window.addEventListener("mouseup", onMouseUp);
        return () => window.removeEventListener("mouseup", onMouseUp);
    }, []);


    useEffect(() => {
        setXTranslate(0);
        setYTranslate(0);
    }, [isDragging])
  /// TODO fix little space in the parent
    return (
        <div style={{position: "relative"}} className={`${isDragging ? "h-0" : ""}`}>

        <div
            style={{ transform: isDragging ? `translate(${xTranslate}px,${yTranslate}px)` : "none", position: isDragging ? "absolute" : "static" }}
            onMouseDown={onMouseDown}
            className={`${isDragging ? "cursor-grabbing absolute w-[150px]" : "transition-all cursor-grab w-full"} flex justify-center items-center text-xl font-bold text-primary p-2 shadow-md border bg-slate-50`}>
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
                <div id="row-1" className="flex gap-2 flex-col w-full h-full"
                    onMouseUp={console.log}
                    onDragOver={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                    }} onDrop={console.log}>
                    {data1.map((item, index) => (
                        <X key={index}>
                            <p>{item}</p>
                        </X>
                    ))}
                </div>
            </div>

            <div className="flex flex-col bg-white rounded-md p-2 shadow-md gap-2 border border-primary w-full">
                <h2 className="text-2xl font-bold text-center text-secondary">row-2</h2>
                <div id="row-2" className="flex gap-2 flex-col w-full h-full" onDragOver={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                }} onDrop={console.log}>
                    {data2.map((item, index) => (
                        <X key={index}>
                            <p>{item}</p>
                        </X>
                    ))}
                </div>
            </div >

            <div className="flex flex-col bg-white rounded-md p-2 shadow-md gap-2 border border-primary w-full">
                <h2 className="text-2xl font-bold text-center text-secondary">row-3</h2>
                <div id="row-3" className="flex gap-2 flex-col w-full h-full" onDragOver={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                }} onDrop={console.log}>
                    {data3.map((item, index) => (
                        <X key={index}>
                            <p>{item}</p>
                        </X>
                    ))}
                </div>
            </div >

        </div >
    )
}

export default MyTasks;
