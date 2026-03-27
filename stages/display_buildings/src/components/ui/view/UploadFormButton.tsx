import { NavigationButton } from "@components/kit/NavigationButton";
import { Allow } from "@components/shared/Allow";
import { IoCloudUploadOutline } from "react-icons/io5";

interface Props {
  enabled?: boolean;
}

export const UploadFormButton = ({ enabled = false }: Props) => {
  if (!enabled) return false;

  return (
    <Allow role="User,Uploader">
      <NavigationButton route="/offers/create" title="Загрузить модель">
        <IoCloudUploadOutline />
      </NavigationButton>
    </Allow>
  );
};
