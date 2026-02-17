import { useRef } from "react";
import classes from "./UserForm.module.css";
import { CreateUser } from "@.types/user-request-types";
import { Input } from "@components/kit/Input";

interface Props {
  onCreateUser: (newUser: CreateUser) => Promise<void>;
}

export const UserForm = ({ onCreateUser }: Props) => {
  const loginRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={classes.container}>
      <h1>Новый пользователь</h1>
      <Input name="login" ref={loginRef} />
      <Input name="email" ref={emailRef} />
      <Input name="password" isPassword={true} ref={passRef} />
    </div>
  );
};
