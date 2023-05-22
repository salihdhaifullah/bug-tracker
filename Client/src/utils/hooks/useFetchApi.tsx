import { useState, useCallback, DependencyList } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationDispatch } from '../context/notification';


interface ICustomResult<T> {
    type: "ok" | "error"
    body?: T
    message?: string
    redirectTo?: string
}

interface IPayload<T> {
    isLoading: boolean;
    result: T | null;
}


export default function useFetchApi<T>
(method: "POST" | "PATCH" | "GET" | "DELETE",
url: string, deps: DependencyList, body?: unknown,
callback?: (arg: T | null) => void): [payload: IPayload<T>, call: () => void] {

    const dispatchNotification = useNotificationDispatch();
    const [result, setResult] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const init = useCallback(async () => {
        setIsLoading(true);

        try {

            const responseBlob = await fetch(`${window.origin}/api/${url}`, {
                method: method,
                body: body ? JSON.stringify(body) : undefined,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const response = await responseBlob.json() as ICustomResult<T>;

            setIsLoading(false);

            if (response?.type === "ok" && response?.body) {
                setResult(response.body);
            }

            if (response?.message) dispatchNotification({
                type: "add",
                payload: {
                    id: Date.now().toString(),
                    type: response.type,
                    message: response.message,
                }
            });

            if(response?.redirectTo) navigate(response?.redirectTo);

            callback && callback(result);

        } catch (err) {
            console.log(err)
            setIsLoading(false);
        }

    }, deps);


    return [{ isLoading, result }, init];
}
