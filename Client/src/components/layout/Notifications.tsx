import { useCallback, useEffect, useState } from "react";
import { INotification, useNotification, useNotificationDispatch } from "../../utils/context/notification";
import { FaTimes, FaCheck } from 'react-icons/fa';

const Notifications = () => {
    const notifications = useNotification();

    return (
        <div className="flex prevent-select flex-col ease-in-out transition-all z-[100] gap-2 justify-center items-center fixed right-10 top-10">
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

    let intervalID:  NodeJS.Timeout;

    const startTimer = useCallback(() => {
        intervalID = setInterval(() => setWidth((prev) => (prev + 1)), 25);
    }, []);

    const stopTimer = useCallback(() => clearInterval(intervalID), []);

    useEffect(() => { if (width === 100) stopTimer() }, [width])

    useEffect(() => startTimer(), [])

    return (
        <div className="flex notification-animation max-w-[70vw] h-auto flex-col rounded shadow-lg dark:shadow-secondary bg-white dark:bg-black">

            <div className="flex flex-row justify-center">

                <div className={`${isError ? "dark:bg-red-400 bg-red-600" : "dark:bg-green-400 bg-green-600"} w-[3px] `}></div>

                <div className="font-extrabold flex justify-center items-center ml-1">
                    {isError ? <FaTimes className="text-white dark:bg-red-400 bg-red-600 rounded-full p-0.5" /> : <FaCheck className="text-white dark:bg-green-400 bg-green-600 rounded-full p-0.5 " />}
                </div>

                <div className="p-2 flex flex-col ml-2 flex-grow">
                    <p className={`${isError ? "dark:text-red-400 text-red-600" : "dark:text-green-400 text-green-600"} text-bold`}>{notification.message}</p>
                </div>

                <div>
                    <FaTimes onClick={deleteNotification} className="cursor-pointer rounded-sm text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 dark:hover:bg-slate-700 hover:bg-slate-300 m-0.5" />
                </div>

            </div>

            <div style={{ width: (width >= 0 ? `${width}%` : "0px") }} className={`${isError ? "dark:bg-red-400 bg-red-600" : "dark:bg-green-400 bg-green-600"} h-[2px] rounded-full`}></div>
        </div>
    )
}
