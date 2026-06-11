import { ReactNode } from "react";

interface Props<T, K extends string> {
  items: T[];
  getKey: (item: T) => K | undefined;
  render: (item: T) => ReactNode;
}

export const UniqueItems = <T, K extends string>({
  items,
  getKey,
  render,
}: Props<T, K>) => {
  const alreadyRendered: Record<K, boolean> = {} as Record<K, boolean>;

  return items.map((item: T) => {
    const key = getKey(item);
    if (key) {
      if (key in alreadyRendered && alreadyRendered[key]) {
        return null;
      }
      alreadyRendered[key] = true;
    }
    return render(item);
  });
};
