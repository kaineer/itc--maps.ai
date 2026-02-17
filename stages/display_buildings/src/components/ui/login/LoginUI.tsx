import classes from "./LoginUI.module.css";
import { useRef, useEffect, MouseEvent, useCallback, useState } from "react";
import { useAuthentication } from "@hooks/useAuthentication";
import { Input } from "@components/kit/Input";

export const LoginUI = () => {
  const loginRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login, error, cleanError } = useAuthentication() || {};

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
          <Input autoFocus={true} name="login" ref={loginRef} />
          <Input name="password" ref={passRef} isPassword={true} />
          <button onClick={handleClick} className={classes.button}>
            Войти
          </button>
        </div>
      </form>
    </div>
  );
};
