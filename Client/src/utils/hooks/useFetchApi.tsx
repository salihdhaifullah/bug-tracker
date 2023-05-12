import { useState, useCallback } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import NewId from '../NewId';
import { useNotificationDispatch } from '../context';


interface ICustomResult<T> {
    type: "ok" | "error" | "validationError"
    body?: T
    message?: string
    redirectTo?: string
}

interface IPayload<T>  {
        isLoading: boolean;
        result: T | null;
        validationError: string | null;
}

export default function useFetchApi<T>(method: "POST" | "PATCH" | "GET" | "DELETE", url: string, body?: unknown): [payload: IPayload<T>, call: () => void] {

    const dispatchNotification = useNotificationDispatch();

    const [result, setResult] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const navigate = useNavigate();

    const callback = useCallback(async () => {
        setIsLoading(true);
        setValidationError(null);
        console.log("RUNS")
        try {

            const responseBlob = await fetch(`${window.origin}/api/${url}`, {
                method: method,
                body: body ? JSON.stringify(body) : undefined
            });

            const response = await responseBlob.json() as ICustomResult<T>;

            console.log(response);
            setIsLoading(false);

            if (response.type === "validationError") {
                if (response?.message) setValidationError(response.message);
                return;
            }

            if (response?.redirectTo) navigate(response?.redirectTo);

            if (response.type === "ok" && response?.body) {
                setResult(response.body);
            }

            if (response.message) {
                dispatchNotification({
                    type: "add",
                    payload: {
                        id: NewId(),
                        type: response.type,
                        message: response.message,
                    },
                });
            }

        } catch (err) {
            setIsLoading(false);
            redirect("/500");
        }

    }, []);

    function call() {
        callback()
    }

    return [{ isLoading, result, validationError }, call];
}
