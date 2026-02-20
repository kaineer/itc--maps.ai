import { NavigationButton } from "@components/kit/NavigationButton";
import { RiUserAddLine } from "react-icons/ri";

interface Props {
  enabled?: boolean;
}

export const AddUser = ({ enabled = true }: Props) => {
  if (!enabled) return null;

  return (
    <NavigationButton route="/users/create" title="Добавить пользователя">
      <RiUserAddLine />
    </NavigationButton>
  );
};
