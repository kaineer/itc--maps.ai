import classes from "./LoginUI.module.css";
import { useRef, useEffect, MouseEvent, useCallback, useState } from "react";
import { uiSlice } from "@slices/uiSlice";
import { useDispatch } from "react-redux";
import { useAuthentication } from "@hooks/useAuthentication";

export const LoginUI = () => {
  const loginRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { login, isAuthenticated } = useAuthentication() || {};
  const { selectViewMode } = uiSlice.actions;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(selectViewMode());
    }
  }, [isAuthenticated]);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const username = loginRef.current?.value || "";
      const password = passRef.current?.value || "";

      e.preventDefault();

      if (login) {
        login({
          login: username,
          password,
        }).catch((error) => {
          if (error instanceof Error) {
            setErrorMessage(String(error.message));
            setTimeout(() => setErrorMessage(null), 10000);
          }
        });
      }
    },
    [login],
  );

  return (
    <div className={classes.login}>
      <form className={classes.form}>
        <div className={classes.column}>
          {errorMessage && (
            <div className={classes.errorMessage}>{errorMessage}</div>
          )}
          <h1 className={classes.title}>Вход</h1>
          <input
            name="login"
            ref={loginRef}
            className={classes.input}
            type="text"
          ></input>
          <input
            name="password"
            ref={passRef}
            className={classes.input}
            type="password"
          ></input>
          <button onClick={handleClick} className={classes.button}>
            Войти
          </button>
        </div>
      </form>
    </div>
  );
};
