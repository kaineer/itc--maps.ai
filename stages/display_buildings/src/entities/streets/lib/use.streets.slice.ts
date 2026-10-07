import { useSelector } from "react-redux";
import { streetsSlice } from "../model/streets.slice";

const { getStreets } = streetsSlice.selectors;

export const useStreetsSlice = () => {
  const streets = useSelector(getStreets);
  return { streets };
};
