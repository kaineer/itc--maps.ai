import { useMemo } from "react";
import { useSelector } from "react-redux";

import { alignmentSlice } from "../model/alignment.slice";

const { getSelectedPolygons, getModelToEdit } = alignmentSlice.selectors;

export const useSelectedPolygons = () => {
  const selectedPolygons = useSelector(getSelectedPolygons);

  return useMemo(() => ({ selectedPolygons }), [selectedPolygons]);
};

export const useModelToEdit = () => {
  const modelToEdit = useSelector(getModelToEdit);

  return useMemo(() => ({ modelToEdit }), [modelToEdit]);
};
