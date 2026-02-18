const notUndefined = (s: string) => !!s && s !== "undefined";

export const getVariationClasses = (
  variation: string,
  classes: { [id: string]: string },
): string => {
  return variation
    .split(" ")
    .map((v) => String(classes["variation-" + v]))
    .filter(notUndefined)
    .join(" ");
};
