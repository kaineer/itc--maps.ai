import { KeyboardEvent, MouseEvent } from "react";

type VoidFn = (e: BindableEvent) => void;

type BindableEvent = KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement>;

const getEventModifiers = <T extends BindableEvent>(e: T): string => {
  const mods: string[] = [];

  if (e.ctrlKey) mods.push("ctrl");
  if (e.altKey) mods.push("alt");
  if (e.shiftKey) mods.push("shift");

  return mods.join("+");
};

const isKeyboardEvent = (e: BindableEvent): e is KeyboardEvent<HTMLElement> => {
  return e && typeof e === "object" && "key" in e;
};

export const bind = <T extends BindableEvent>(
  mapping: Record<string, VoidFn>,
) => {
  return (e: T) => {
    const modifiers = getEventModifiers(e);

    const handler = isKeyboardEvent(e)
      ? mapping[[modifiers, e.key].filter((x) => !!x).join("+")]
      : mapping[modifiers];

    if (typeof handler === "function") {
      handler(e);
    }
  };
};
