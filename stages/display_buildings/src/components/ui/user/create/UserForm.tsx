import { useRef } from "react";
import classes from "./UserForm.module.css";
import { CreateUser } from "@.types/user-request-types";
import { Input } from "@components/kit/Input";
import { Button } from "@components/kit/Button";

interface Props {
  onCreateUser: (newUser: CreateUser) => Promise<void>;
}

export const UserForm = ({ onCreateUser }: Props) => {
  const loginRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const login = loginRef?.current?.value;
    const email = emailRef?.current?.value;
    const pass = passRef?.current?.value;

    if (login && email && pass) {
      onCreateUser({
        login,
        email,
        password: pass,
      });
    }
  };

  return (
    <div className={classes.container}>
      <h1>Новый пользователь</h1>
      <Input name="login" ref={loginRef} />
      <Input name="email" ref={emailRef} />
      <Input name="password" isPassword={true} ref={passRef} />
      <Button variation="" onClick={handleSubmit}>
        Создать
      </Button>
    </div>
  );
};
