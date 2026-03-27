import { MouseEvent } from "react";
import { useAuthentication } from "@hooks/useAuthentication";
import { IoIosLogOut } from "react-icons/io";
import { NavigationButton } from "@components/kit/NavigationButton";
import { Allow } from "@components/shared/Allow";

interface Props {
  enabled?: boolean;
}

export const Logout = ({ enabled = true }: Props) => {
  const { logout, isAuthenticated } = useAuthentication();

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (logout) logout();
  };

  if (!enabled) return null;

  return (
    <Allow condition={isAuthenticated}>
      <NavigationButton enabled={enabled} onClick={handleClick} title="Выйти">
        <IoIosLogOut />
      </NavigationButton>
    </Allow>
  );
};
