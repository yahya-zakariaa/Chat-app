import { useRef } from "react";

export const useDebounce = (callback, delay) => {
  const timer = useRef();

  const debouncedFunction = (...args) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedFunction;
};
