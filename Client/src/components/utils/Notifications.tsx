import { useCallback, useEffect, useState } from "react";
import { INotification, useNotification, useNotificationDispatch } from "../../utils/context";
import { FaTimes, FaCheck } from 'react-icons/fa';

const Notifications = () => {
    const notifications = useNotification();

    return (
        <div className="flex flex-col ease-in-out transition-all gap-2 justify-center items-center fixed right-10 top-10">
            {notifications.map((notification) => (
                <Notification notification={notification} key={notification.id} />
            ))}
        </div>
    )
}

export default Notifications


const Notification = ({ notification }: { notification: INotification }) => {
    const isError = notification.type === "error";
    const [width, setWidth] = useState(-25);

    const dispatchNotification = useNotificationDispatch();

    function deleteNotification() {
        dispatchNotification({ type: 'delete', payload: notification })
    }

    setTimeout(() => deleteNotification(), 5000);

    let intervalID: number;

    const startTimer = useCallback(() => {
        intervalID = setInterval(() => setWidth((prev) => (prev + 1)), 20);
    }, []);

    const stopTimer = useCallback(() => clearInterval(intervalID), []);

    useEffect(() => { if (width === 100) stopTimer() }, [width])

    useEffect(() => startTimer(), [])

    return (
        <div className="flex notification-animation flex-col rounded shadow-lg bg-gray-50 drop-shadow-xl">

            <div className="flex flex-row justify-center">

                <div className={`${isError ? "bg-red-600" : "bg-green-600"} w-[3px] `}></div>

                <div className="font-extrabold flex justify-center items-center ml-1">
                    {isError ? <FaTimes className="text-white bg-red-600 rounded-full p-0.5" /> : <FaCheck className="text-white bg-green-600 rounded-full p-0.5 " />}
                </div>

                <div className="p-2 flex flex-col  flex-grow">
                    <p className={`${isError ? "text-red-600" : "text-green-600"} text-bold`}>{notification.message}</p>
                </div>

                <div>
                    <FaTimes onClick={deleteNotification} className="text-gray-500 rounded-sm hover:text-gray-700 hover:bg-slate-200 m-0.5 cursor-pointer" />
                </div>

            </div>

            <div style={{ width: (width >= 0 ? `${width}%` : "0px") }} className={`${isError ? "bg-red-600" : "bg-green-600"} h-[2px] rounded-full`}></div>
        </div>
    )
}
