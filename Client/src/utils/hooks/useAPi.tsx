import { useCallback } from 'react';
import Api from '../api';
import { redirect } from 'react-router-dom';
import NewId from '../NewId';
import { useTasksDispatch } from '../context';

export default function useApi<T>() {
    const dispatch = useTasksDispatch() as any;

    const callBack = useCallback(async (
        method: "POST" | "PATCH" | "GET" | "DELETE",
        url: string,
        setValidation?: (msg: string) => void,
        setState?: (state: T) => void,
        body?: unknown,
    ) => {
        const api = new Api<T>();
        try {
            const result = await api.Body(body).Method(method).Route(url).AwaitAsync();

            dispatch({
                type: 'added',
                id: NewId(),
                title: "testses",
                error: false
            });

            if (result.type === "validationError" && result?.massage && setValidation) {
                setValidation(result.massage);
                return;
            }

            if (result?.redirectTo) {
                redirect(result?.redirectTo);
                return;
            }

            if (result.type === "ok" && result?.body && setState) {
                setState(result.body);
                return;
            }


        } catch (error) {
            console.log();
        }
    }, [])

    return callBack;
}
