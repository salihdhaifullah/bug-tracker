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
    role: "developer" | "admin" | "project_manger" | "reporter";
}


const UserContext = createContext<IUser | null>(null);
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
            if (!action.payload) return user;
            user = action.payload;
            return user;
        }
        case 'logout': {
            user = null;
            return user;
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export default function UserProvider({ children }: { children: ReactElement }) {
    const [User, dispatchUser] = useReducer(userReducer, null);

    return (
        <UserContext.Provider value={User}>
            <UserDispatchContext.Provider value={dispatchUser}>
                {children}
            </UserDispatchContext.Provider>
        </UserContext.Provider>
    );
}






