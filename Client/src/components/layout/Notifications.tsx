import { useNotification } from "../../utils/context/notification";
import Notification from "./Notification";

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

export default Notifications;
