import { NavigationButton } from "@components/kit/NavigationButton";
import { Allow } from "@components/shared/Allow";
import { useAuthentication } from "@hooks/useAuthentication";
import { IoLogInOutline } from "react-icons/io5";

interface Props {
  enabled?: boolean;
}

export const LogIn = ({ enabled = true }: Props) => {
  const { isAuthenticated } = useAuthentication();

  if (!enabled) return null;

  return (
    <Allow condition={!isAuthenticated}>
      <NavigationButton route="/login" title="Войти в приложение">
        <IoLogInOutline />
      </NavigationButton>
    </Allow>
  );
};
