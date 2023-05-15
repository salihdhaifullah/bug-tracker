import { Dispatch, ReactElement, createContext, useContext, useReducer } from 'react';
const isUser = localStorage.getItem("user");
const user = isUser ? JSON.parse(isUser) as IUser : null;

const NotificationContext = createContext<INotification[]>([]);
const NotificationDispatchContext = createContext<Dispatch<INotificationAction>>(() => null);

const UserContext = createContext<IUser | null>(user);
const UserDispatchContext = createContext<Dispatch<IUserAction>>(() => null);

export function NotificationProvider({ children }: { children: ReactElement }) {

  const [Notification, dispatchNotification] = useReducer(notificationReducer, []);

  return (
    <NotificationContext.Provider value={Notification}>
      <NotificationDispatchContext.Provider value={dispatchNotification}>
        {children}
      </NotificationDispatchContext.Provider>
    </NotificationContext.Provider>
  );
}

export function UserProvider({ children }: { children: ReactElement }) {

  const [User, dispatchUser] = useReducer(userReducer, user);

  return (
    <UserContext.Provider value={User}>
      <UserDispatchContext.Provider value={dispatchUser}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export function Provider({ children }: { children: ReactElement[] }) {
  return (
      <UserProvider>
    <NotificationProvider>
      <>{children}</>
    </NotificationProvider>
  </UserProvider>
  )
}

export function useNotification() {
  return useContext(NotificationContext);
}

export function useNotificationDispatch() {
  return useContext(NotificationDispatchContext);
}

export function useUser() {
  return useContext(UserContext);
}

export function useUserDispatch() {
  return useContext(UserDispatchContext);
}

type INotificationAction = {
  type: "add" | "delete";
  payload?: INotification
}

function notificationReducer(notification: INotification[], action: INotificationAction): INotification[] {
  switch (action.type) {
    case 'add': {
      if (!action.payload) return notification;
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

type IUserAction = {
  type: "add" | "logout";
  payload?: IUser
}

function userReducer(user: IUser | null, action: IUserAction): IUser | null {
  switch (action.type) {
    case 'add': {
      console.log(action.payload);
      if (!action.payload) return user;
      user = action.payload;
      localStorage.setItem("user", JSON.stringify(user))
      return user;
    }
    case 'logout': {
      localStorage.clear();
      user = null;
      return user;
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


export interface IUser {
  id: number;
  imageId: number;
  email: string;
  fullName: string;
  role: "ADMIN" | "DEVELOPER" | "PROJECT_MANGER" | "REPORTER";
}
