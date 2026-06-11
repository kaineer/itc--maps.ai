import { ReactNode } from "react";

interface Props<T> {
  items: T[];
  render: (item: T) => ReactNode;
}

export const MapItems = <T,>({ items, render }: Props<T>) => {
  return (items || []).map((item) => {
    return render(item);
  });
};
