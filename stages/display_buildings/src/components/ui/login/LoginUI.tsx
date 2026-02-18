import classes from "./LoginUI.module.css";
import { useRef, useEffect, MouseEvent, useCallback, useState } from "react";
import { useAuthentication } from "@hooks/useAuthentication";
import { Input } from "@components/kit/Input";
import { Button } from "@components/kit/Button";
import { Column } from "@components/kit/Container";
import { toast } from "sonner";

export const LoginUI = () => {
  const loginRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const { login, error, cleanError } = useAuthentication() || {};

  useEffect(() => {
    if (error) {
      toast.error(error, { duration: 5000 });
      setTimeout(cleanError, 5000);
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
        <Column gap={24}>
          <h1 className={classes.title}>Вход</h1>
          <Input autoFocus={true} name="login" ref={loginRef} />
          <Input name="password" ref={passRef} isPassword={true} />
          <Button onClick={handleClick} variation="640x100 violet">
            Войти
          </Button>
        </Column>
      </form>
    </div>
  );
};
