import { useRef, MouseEvent } from "react";
import classes from "./UserForm.module.css";
import { CreateUser } from "@.types/user-request-types";
import { Input } from "@components/kit/Input";
import { Button } from "@components/kit/Button";
import { Column } from "@components/kit/Container";

interface Props {
  onCreateUser: (newUser: Partial<CreateUser>) => Promise<void>;
}

export const UserForm = ({ onCreateUser = () => Promise.resolve() }: Props) => {
  const loginRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const schoolRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const login = loginRef?.current?.value;
    const name = nameRef?.current?.value;
    const email = emailRef?.current?.value;
    const pass = passRef?.current?.value;

    const phone = phoneRef?.current?.value;
    const school = schoolRef?.current?.value;

    if (login && email && pass) {
      onCreateUser({
        login,
        name,
        phone,
        schoolName: school,
        email,
        password: pass,
      });
    }
  };

  return (
    <div className={classes.container}>
      <Column gap={24}>
        <h1>Новый пользователь</h1>
        <Input placeholder="Логин" name="login" ref={loginRef} />
        <Input placeholder="Имя" name="name" ref={nameRef} />
        <Input placeholder="Email" name="email" ref={emailRef} />
        <Input placeholder="Телефон" name="phone" ref={phoneRef} />
        <Input placeholder="Школа" name="school" ref={schoolRef} />
        <Input
          placeholder="Password"
          name="password"
          isPassword={true}
          ref={passRef}
        />
        <Button variation="640x100 violet" onClick={handleSubmit}>
          Создать
        </Button>
      </Column>
    </div>
  );
};
