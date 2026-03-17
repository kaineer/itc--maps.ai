export interface KeyboardModifiers {
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
}

const defaultModifiers: KeyboardModifiers = {
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
};

const createGetModifier = (e: unknown) => {
  if (e && typeof e === "object") {
    return (name: string) => {
      const key = name + "Key";
      if (key in e) {
        return (e as { [id: string]: boolean })[key];
      }
    };
  } else {
    return () => false;
  }
};

const modifiersOfInterest = ["ctrl", "alt", "shift"];

export const getKeyboardModifiers = (e: unknown): KeyboardModifiers => {
  if (!e || typeof e !== "object") {
    return defaultModifiers;
  }

  const getKey = createGetModifier(e);

  return modifiersOfInterest.reduce(
    (acc, value) => ({ ...acc, [value + "Key"]: getKey(value) }),
    {},
  ) as KeyboardModifiers;
};
