import { useEffect, useRef, useState, ReactElement, DragEvent, useMemo } from "react"
import useFetchApi from "../utils/hooks/useFetchApi";
import { Priority, Status, Type } from "../types";
import CircleProgress from "../components/utils/CircleProgress";
import labelsColors from "../utils/labelsColors";
import { Link, useParams } from "react-router-dom";
import SelectButton from "../components/utils/SelectButton";
import { priorityOptions, typeOptions } from "./CreateTicket";
import Button from "../components/utils/Button";
import SearchFiled from "../components/utils/SearchFiled";

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
                className="static w-full flex justify-center items-center text-xl font-bold text-primary dark:text-secondary p-2 shadow-md dark:shadow-secondary/40 border bg-slate-50 dark:bg-slate-950">
                {" "} {props.children}
            </div>
        </div>
    );
}

const MyTasks = () => {
    const {projectId} = useParams();
    const [data, setData] = useState<IItem[]>([])
    const [search, setSearch] = useState("");
    const [ticketType, setTicketType] = useState("all");
    const [ticketPriority, setTicketPriority] = useState("all");

    const [_, callUpdate] = useFetchApi<unknown, { id: string, status: Status }>("PATCH", "ticket/status", [])
    const [tasksPayload, callTasks] = useFetchApi<IItem[], unknown>("GET", `ticket/my-tickets/${projectId}?search=${search}&type=${ticketType}&priority=${ticketPriority}`, [search, ticketType, ticketPriority], (result) => { setData(result) })

    useEffect(() => { callTasks() }, [ticketType, ticketPriority])

    const handelSearch = () => {
        callTasks()
    }

    const realScreenHeightOffset = useMemo(() => window.screen.height * 0.3, [window.screen.height]);
    const realScreenHeightScroll = useMemo(() => window.screen.height * 0.01, [window.screen.height]);

    const DragOverListener = (e: globalThis.DragEvent) => {
        if ((e.screenY + realScreenHeightOffset) >= window.screen.height) window.scrollBy(0, realScreenHeightScroll + ((e.screenY + realScreenHeightOffset) - window.screen.height));
        if ((e.screenY - realScreenHeightOffset) <= 0) window.scrollBy(0, -realScreenHeightScroll + (e.screenY - realScreenHeightOffset));
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
        <div className="flex flex-col w-full p-2 py-10 my-10">

            <div className="flex flex-row gap-4 w-full flex-wrap items-center justify-between">
                <div className="flex items-center justify-center">
                    <div className="max-w-[400px]">
                        <SearchFiled onClick={handelSearch} label="Search for tickets" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>

                    <div className="flex gap-1 flex-row flex-wrap">
                        <SelectButton value={ticketPriority} setValue={setTicketPriority} label="priority" options={["all", ...priorityOptions]} />
                        <SelectButton value={ticketType} setValue={setTicketType} label="type" options={["all", ...typeOptions]} />
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                    <Link to={`/project/${projectId}/create-ticket`}>
                        <Button>create ticket</Button>
                    </Link>

                    <Link to={`/project/${projectId}`}>
                        <Button>project</Button>
                    </Link>
                </div>

            </div>

            <div className="flex flex-wrap  flex-row justify-center items-start gap-2">

                {!tasksPayload.isLoading ? (
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
        </div>
    )
}

export default MyTasks;
