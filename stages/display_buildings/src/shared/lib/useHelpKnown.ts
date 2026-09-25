import { helpInfoSlice, KnownMode } from "@features/control-hints";
import { useDispatch, useSelector } from "react-redux";

export const useHelpKnown = (mode: KnownMode) => {
  const dispatch = useDispatch();
  const { getKnown } = helpInfoSlice.selectors;
  const { setKnown } = helpInfoSlice.actions;

  const isKnown = (useSelector(getKnown) || {})[mode];

  const setIsKnown = () => {
    dispatch(setKnown(mode));
  }

  const getIsKnown = () => {
    return isKnown;
  }

  return {
    setIsKnown,
    getIsKnown,
  };
}
