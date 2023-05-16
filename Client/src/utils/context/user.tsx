import { Dispatch, ReactElement, createContext, useContext, useReducer } from 'react';

type IUserAction = {
    type: "add" | "logout";
    payload?: IUser
}


export interface IUser {
    id: number;
    imageId: number;
    email: string;
    fullName: string;
    role: "ADMIN" | "DEVELOPER" | "PROJECT_MANGER" | "REPORTER";
}


const isUser = localStorage.getItem("user");
const user = isUser ? JSON.parse(isUser) as IUser : null;

const UserContext = createContext<IUser | null>(user);
const UserDispatchContext = createContext<Dispatch<IUserAction>>(() => null);

export function useUser() {
    return useContext(UserContext);
}

export function useUserDispatch() {
    return useContext(UserDispatchContext);
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

export default function UserProvider({ children }: { children: ReactElement }) {
    const [User, dispatchUser] = useReducer(userReducer, user);

    return (
        <UserContext.Provider value={User}>
            <UserDispatchContext.Provider value={dispatchUser}>
                {children}
            </UserDispatchContext.Provider>
        </UserContext.Provider>
    );
}






