import { alignmentSlice } from "@slices/alignmentSlice";
import { useSelector } from "react-redux";

const { getSelectedPolygons } = alignmentSlice.selectors;

export const useSelectedPolygons = () => {
  const selectedPolygons = useSelector(getSelectedPolygons);

  return { selectedPolygons };
};
