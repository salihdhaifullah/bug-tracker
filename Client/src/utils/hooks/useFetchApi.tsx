import { useState, useCallback, DependencyList } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationDispatch } from '../context/notification';

interface IResult<T> {
    type: "ok" | "error"
    body?: T
    message?: string
    redirectTo?: string
}

interface IPayload<T> {
    isLoading: boolean;
    result: T | null;
}


export default function useFetchApi<R = undefined, B = undefined>
(method: "POST" | "PATCH" | "GET" | "DELETE",
url: string, deps: DependencyList = [],
callback?: (arg: R) => void): [payload: IPayload<R>, call: (body?: B) => void] {

    const dispatchNotification = useNotificationDispatch();
    const [result, setResult] = useState<R | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const init = useCallback(async (body?: B) => {
        setIsLoading(true);

        try {
            const responseBlob = await fetch(`${window.origin}/api/${url}`, {
                method: method,
                body: body ? JSON.stringify(body) : undefined,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const response = await responseBlob.json() as IResult<R>;

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

            callback && callback(response.body as R);

            if (response?.redirectTo) navigate(response?.redirectTo);
        } catch (err) {
            console.error(err)
        } finally {

            setIsLoading(false);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);


    return [{ isLoading, result }, init];
}
