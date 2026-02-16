import classes from "./LoginUI.module.css";
import { useRef, useEffect, MouseEvent, useCallback, useState } from "react";
import { useAuthentication } from "@hooks/useAuthentication";
import { useNavigate } from "react-router";

export const LoginUI = () => {
  const loginRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, error, cleanError, isAuthenticated } =
    useAuthentication() || {};

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/view");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setErrorMessage(error);

    if (error) {
      setTimeout(() => {
        cleanError();
      }, 5000);
    }
  }, [error]);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const username = loginRef.current?.value || "";
      const password = passRef.current?.value || "";

      e.preventDefault();

      if (login) {
        login({
          login: username,
          password,
        }).then(() => {
          if (passRef.current) {
            passRef.current.value = "";
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
            autoFocus={true}
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
