import { Dispatch, ReactElement, createContext, useContext, useReducer } from 'react';

const NotificationContext = createContext<INotification[]>([]);
const NotificationDispatchContext = createContext<Dispatch<IAction>>(() => null);

export function NotificationProvider({ children }: { children: ReactElement[] }) {

  const [Notification, dispatchNotification] = useReducer(notificationReducer, []);

  return (
    <NotificationContext.Provider value={Notification}>
      <NotificationDispatchContext.Provider value={dispatchNotification}>
        {children}
      </NotificationDispatchContext.Provider>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}

export function useNotificationDispatch() {
  return useContext(NotificationDispatchContext);
}

type IAction = {
  type: "add" | "delete";
  payload?: INotification
}

function notificationReducer(notification: INotification[], action: IAction): INotification[] {
  switch (action.type) {
    case 'add': {
      if (!action.payload) return notification;
      return [...notification, {
        id: action.payload.id,
        message: action.payload.message,
        type: action.payload.type
      }];
    }
    case 'delete': {
      return notification.filter(t => t.id !== action.payload?.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export interface INotification {
  id: string;
  message: string;
  type: "error" | "ok";
};
