import { NavigationButton } from "@components/kit/NavigationButton";
import { Allow } from "@components/shared/Allow";
import { CiViewList } from "react-icons/ci";

interface Props {
  enabled?: boolean;
}

export const TrackList = ({ enabled = true }: Props) => {
  if (!enabled) return null;

  return (
    <Allow role="Creator,Admin">
      <NavigationButton route="/tracks" title="Список экскурсий">
        <CiViewList />
      </NavigationButton>
    </Allow>
  );
};
