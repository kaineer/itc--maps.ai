import classes from "./Input.module.css";
import { InputEventHandler, RefObject, useEffect } from "react";

interface Props {
  defaultValue?: string;
  value?: string;
  name: string;
  placeholder?: string;
  ref?: RefObject<HTMLInputElement | null>;
  onInput?: InputEventHandler<HTMLInputElement>;
  autoFocus?: boolean;
  isPassword?: boolean;
}

export const Input = ({
  defaultValue,
  value,
  name,
  placeholder,
  ref,
  onInput,
  autoFocus = false,
  isPassword = false,
}: Props) => {
  useEffect(() => {
    if (ref?.current) {
      if (defaultValue) {
        ref.current.value = defaultValue;
      } else if (value) {
        /** defaultValue not specified */
        ref.current.value = value;
      }
    }
  }, [ref, ref?.current, defaultValue, value]);

  return (
    <input
      autoFocus={autoFocus}
      className={classes.input}
      name={name}
      placeholder={placeholder}
      ref={ref}
      onInput={onInput}
      type={isPassword ? "password" : "text"}
    />
  );
};
