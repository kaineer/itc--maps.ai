import { fetchStartPositionFromHash } from "@slices/buildingsSlice";
import { AppDispatch } from "@store/index";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const ViewInitialization = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchStartPositionFromHash());
  }, [dispatch]);

  return null;
};
