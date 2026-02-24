import { NavigationButton } from "@components/kit/NavigationButton";
import { Allow } from "@components/shared/Allow";
import { PiUsersLight } from "react-icons/pi";

interface Props {
  enabled?: boolean;
}

export const UserList = ({ enabled = true }: Props) => {
  if (!enabled) return null;

  return (
    <Allow role="Admin">
      <NavigationButton route="/users" title="Список пользователей">
        <PiUsersLight />
      </NavigationButton>
    </Allow>
  );
};
