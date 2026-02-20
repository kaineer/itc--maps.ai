import { NavigationButton } from "@components/kit/NavigationButton";
import { buildingsSlice } from "@slices/buildingsSlice";
import { FaStreetView } from "react-icons/fa";
import { useSelector } from "react-redux";

interface Props {
  enabled?: boolean;
}

export const ViewButton = ({ enabled = true }: Props) => {
  if (!enabled) return null;

  const { getLastLoadedPosition } = buildingsSlice.selectors;
  const lastLoadedPosition = useSelector(getLastLoadedPosition);
  const [x, _, z] = lastLoadedPosition;
  const url = "/view#x=" + x + "&z=" + z;

  return (
    <NavigationButton route={url} title="Перейти в режим просмотра">
      <FaStreetView />
    </NavigationButton>
  );
};
