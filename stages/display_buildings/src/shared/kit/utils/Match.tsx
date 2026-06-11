// @seealso: https://youtu.be/HBpn1CNUJwg?t=200

import { ReactNode } from "react";

type MatchPropsBase = string;

interface ValueProp<T> {
  value: T;
}

type MatchProps<T extends MatchPropsBase> = Record<T, () => ReactNode> &
  ValueProp<T>;

export function Match<T extends MatchPropsBase>(props: MatchProps<T>) {
  const render = props[props.value];
  return <>{render()}</>;
}
