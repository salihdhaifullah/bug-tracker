import { RefObject, useCallback, useEffect } from "react";

const useOnClickOutside = (ref: RefObject<HTMLElement> | RefObject<HTMLElement>[] | null, handler: (event: MouseEvent) => void) => {


  const array = (refs: RefObject<HTMLElement>[], event: MouseEvent) => {
    let isClickedIn = false;

    for (let i = 0; i < refs.length; i++) {
      const currentRef = refs[i]?.current;
      if (currentRef === null) continue;

      if (event.composedPath().includes(currentRef)) {
        isClickedIn = true;
        break;
      }
    }

    if (!isClickedIn) handler(event);
  }

  const listener = useCallback((event: MouseEvent) => {
    if (Array.isArray(ref)) array(ref, event);
    else if (ref?.current === null) handler(event);
    else if (ref?.current && !event.composedPath().includes(ref.current)) handler(event);
  }, [ref, handler])

  useEffect(() => {
    document.addEventListener("click", listener, { capture: true });
    return () => { document.removeEventListener("click", listener) };
  }, [listener]);
}

export default useOnClickOutside;
