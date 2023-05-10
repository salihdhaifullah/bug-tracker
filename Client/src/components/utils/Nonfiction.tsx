import { useTasks, useTasksDispatch } from "../../utils/context";

const Nonfiction = () => {

    const tasks = useTasks() as any;

    return (
    <div className="flex flex-col gap-2 justify-center items-center fixed right-10 top-10">
        {tasks.map((v: any) => (
            <Item v={v} key={v.id}/>
        ))}
    </div>
  )
}

export default Nonfiction

const Item = ({v}: any) => {
    const dispatch = useTasksDispatch() as any;

    setTimeout(() => {
        dispatch({
            type: 'deleted',
            id: v.id
          });
    }, 1500);

    return (
        <div key={v.id} className="flex flex-col justify-center shadow-lg bg-white border">
        {v.error ? (
        <h1 className="text-red-600 text-bold">error {v.title}</h1>
        ) : (
        <h1 className="text-green-600 text-bold">massage {v.title}</h1>
        )}
    </div>
    )
}
