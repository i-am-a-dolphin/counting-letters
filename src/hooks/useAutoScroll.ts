import { useEffect, useRef } from "react";

export const useAutoScroll = <T extends HTMLElement>(
  deps: React.DependencyList
) => {
  const scrollRef = useRef<T>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, deps);

  return scrollRef;
};
