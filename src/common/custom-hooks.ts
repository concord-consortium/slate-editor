import { useEffect, useRef, useState } from "react";

/**
 * cf. https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
 * cf. https://usehooks.com/usePrevious/
 * @param {*} value 
 */
export const usePrevious = <T extends unknown>(value: T) => {
  const ref = useRef<T>();
  useEffect(function() {
    ref.current = value;
  }, [value]);
  return ref.current;
};

/**
 * Combines useState and useRef hooks to provide a state value that can be referenced
 * from function callbacks that would otherwise close around a stale state value.
 * cf. https://blog.castiel.me/posts/2019-02-19-react-hooks-get-current-state-back-to-the-future/
 * @param {*} initialValue 
 */
export const useRefState = <T extends unknown>(initialValue: T) => {
  const [state, setState] = useState<T>(initialValue);
  const stateRef = useRef<T>(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  return [state, stateRef, setState];
};
