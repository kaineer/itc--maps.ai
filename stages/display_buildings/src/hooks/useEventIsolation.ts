import { useEffect, useRef, type MouseEvent } from "react";

// Кастомный хук для изоляции событий
export function useEventIsolation<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleEvent = (e: Event) => {
      e.stopPropagation();
    };

    // Перехватываем все типы событий
    const eventTypes = ["click", "mousedown", "mouseup", "mousemove", "wheel"];

    eventTypes.forEach((eventType) => {
      element.addEventListener(eventType, handleEvent);
    });

    return () => {
      eventTypes.forEach((eventType) => {
        element.removeEventListener(eventType, handleEvent);
      });
    };
  }, [ref.current]);

  return ref;
}
