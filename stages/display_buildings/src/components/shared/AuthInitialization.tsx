import { authFromLocalStorage } from "@slices/authenticationSlice";
import { AppDispatch } from "@store/index";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const AuthInitialization = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(authFromLocalStorage());
  }, [dispatch]);

  return null;
};
