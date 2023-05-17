import { RefObject, useCallback, useEffect } from "react";

const useOnClickOutside = (ref: RefObject<HTMLElement> | null, handler: (event: MouseEvent) => void) => {

    const listener = useCallback((event: MouseEvent) => {
        if (ref?.current && !event.composedPath().includes(ref.current)) handler(event);
      }, [ref, handler])

    useEffect(() => {
        document.addEventListener("click", listener);
        return () => { document.removeEventListener("click", listener) };
      }, [listener]);
  }

export default useOnClickOutside;
