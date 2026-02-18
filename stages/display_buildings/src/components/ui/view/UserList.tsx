import { NavigationButton } from "@components/kit/NavigationButton";
import { PiUsersLight } from "react-icons/pi";

interface Props {
  enabled: boolean;
}

export const UserList = ({ enabled }: Props) => {
  if (!enabled) return null;

  return (
    <NavigationButton route="/users">
      <PiUsersLight />
    </NavigationButton>
  );
};
