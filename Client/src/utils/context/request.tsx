import { Dispatch, ReactElement, createContext, useContext, useReducer } from 'react';

const RequestContext = createContext<AbortController[]>([]);
const RequestDispatchContext = createContext<Dispatch<AbortController>>(() => null);


export function useRequest() {
    return useContext(RequestContext);
}

export function useRequestDispatch() {
    return useContext(RequestDispatchContext);
}

function requestReducer(request: AbortController[], action: AbortController): AbortController[] {
    return [...request, action];
}


export default function RequestProvider({ children }: { children: ReactElement }) {
    const [Request, dispatchRequest] = useReducer(requestReducer, []);

    return (
        <RequestContext.Provider value={Request}>
            <RequestDispatchContext.Provider value={dispatchRequest}>
                {children}
            </RequestDispatchContext.Provider>
        </RequestContext.Provider>
    );
}




