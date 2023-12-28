import { Dispatch, ReactElement, createContext, useContext, useReducer } from 'react';

const NotificationContext = createContext<INotification[]>([]);
const NotificationDispatchContext = createContext<Dispatch<INotificationAction>>(() => null);


export function useNotification() {
    return useContext(NotificationContext);
}

export function useNotificationDispatch() {
    return useContext(NotificationDispatchContext);
}

export interface INotification {
    id: string;
    message: string;
    type: "error" | "ok";
}

type INotificationAction = {
    type: "add" | "delete";
    payload?: INotification
}

function notificationReducer(notification: INotification[], action: INotificationAction): INotification[] {
    switch (action.type) {
        case 'add': {
            if (!action.payload) return notification;
            const lastNotification = notification.length ? notification[notification.length-1] : null;
            if (lastNotification && lastNotification.message === action.payload.message) {
                return notification;
            }
            return [...notification, action.payload];
        }
        case 'delete': {
            return notification.filter(n => n.id !== action.payload?.id);
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}



export default function NotificationProvider({ children }: { children: ReactElement }) {
    const [Notification, dispatchNotification] = useReducer(notificationReducer, []);

    return (
        <NotificationContext.Provider value={Notification}>
            <NotificationDispatchContext.Provider value={dispatchNotification}>
                {children}
            </NotificationDispatchContext.Provider>
        </NotificationContext.Provider>
    );
}




