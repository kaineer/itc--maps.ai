import classes from "./LoginUI.module.css";
import { useRef, MouseEvent, useEffect } from "react";
import { uiSlice } from "@slices/uiSlice";
import { useDispatch } from "react-redux";
import { useAuthentication } from "@hooks/useAuthentication";

export const LoginUI = () => {
  const loginRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);
  const { selectViewMode } = uiSlice.actions;
  const dispatch = useDispatch();

  const { login, username, expiresAt } = useAuthentication();

  useEffect(() => {
    if (username && expiresAt && expiresAt > Date.now()) {
      dispatch(selectViewMode());
    }
  }, [username, expiresAt]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const username = loginRef.current?.value || "";
    const password = passRef.current?.value || "";

    e.preventDefault();

    login(username, password);
  };

  return (
    <div className={classes.login}>
      <form className={classes.form}>
        <div className={classes.column}>
          <h1 className={classes.title}>Вход</h1>
          <input ref={loginRef} className={classes.input} type="text"></input>
          <input
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
