import { INotification, useNotification, useNotificationDispatch } from "../../utils/context";

const Nonfiction = () => {

    const notifications = useNotification();

    return (
    <div className="flex flex-col gap-2 justify-center items-center fixed right-10 top-10">
        {notifications.map((notification) => (
            <Item v={notification} key={notification.id}/>
        ))}
    </div>
  )
}

export default Nonfiction

const Item = ({v}: {v: INotification}) => {
    const dispatchNotification = useNotificationDispatch();

    setTimeout(() => { dispatchNotification({ type: 'delete' , payload: v }) }, 3000);

    return (
        <div key={v.id} className="flex flex-col justify-center shadow-lg bg-white border">
        {v.type === "error" ? (
        <h1 className="text-red-600 text-bold">error {v.message}</h1>
        ) : (
        <h1 className="text-green-600 text-bold">massage {v.message}</h1>
        )}
    </div>
    )
}
