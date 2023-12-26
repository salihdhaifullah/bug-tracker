import { useCallback, useEffect, useRef, useState } from "react";
import { INotification, useNotificationDispatch } from "../../utils/context/notification";
import { FaTimes, FaCheck } from 'react-icons/fa';


const Notification = ({ notification }: { notification: INotification }) => {
    const isError = notification.type === "error";
    const [width, setWidth] = useState(-25);

    const dispatchNotification = useNotificationDispatch();

    function deleteNotification() {
        dispatchNotification({ type: 'delete', payload: notification })
    }

    setTimeout(() => deleteNotification(), 5000);

    const intervalIDRef = useRef<number>();

    const startTimer = useCallback(() => {
        intervalIDRef.current = setInterval(() => setWidth((prev) => (prev + 1)), 25);
    }, []);

    const stopTimer = useCallback(() => clearInterval(intervalIDRef.current), []);

    useEffect(() => { if (width === 100) stopTimer() }, [stopTimer, width])

    useEffect(() => startTimer(), [startTimer])


    return (
        <div className="flex notification-animation max-w-[70vw] h-auto flex-col rounded shadow-lg dark:shadow-secondary/40 bg-white dark:bg-black">

            <div className="flex flex-row justify-center">

                <div className={`${isError ? "dark:bg-red-400 bg-red-600" : "dark:bg-green-400 bg-green-600"} w-[3px] `}></div>

                <div className="font-extrabold flex justify-center items-center ml-1">
                    {isError ? <FaTimes className="text-white dark:bg-red-400 bg-red-600 rounded-full p-0.5" /> : <FaCheck className="text-white dark:bg-green-400 bg-green-600 rounded-full p-0.5 " />}
                </div>

                <div className="p-2 flex flex-col ml-2 flex-grow">
                    <div className={`${isError ? "dark:!text-red-400 !text-red-600" : "dark:!text-green-400 !text-green-600"}`}>
                        {notification.message}
                    </div>
                </div>

                <div>
                    <FaTimes onClick={deleteNotification} className="cursor-pointer rounded-sm text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 dark:hover:bg-slate-700 hover:bg-slate-300 m-0.5" />
                </div>

            </div>

            <div style={{ width: (width >= 0 ? `${width}%` : "0px") }} className={`${isError ? "dark:bg-red-400 bg-red-600" : "dark:bg-green-400 bg-green-600"} h-[2px] rounded-full`}></div>
        </div>
    )
}

export default Notification;
