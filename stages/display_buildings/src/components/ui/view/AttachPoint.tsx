import { NavigationButton } from "@components/kit/NavigationButton";
import { Allow } from "@components/shared/Allow";
import { viewSlice } from "@slices/viewSlice";
import { usePutTrackPointMutation } from "@store/api/TracksApi";
import { IoIosAttach } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface Props {
  enabled?: boolean;
}

export const AttachPoint = ({ enabled = true }: Props) => {
  const { getPointToAttach, getCameraPosition, getCameraTarget } =
    viewSlice.selectors;
  const pointToAttach = useSelector(getPointToAttach);

  const position = useSelector(getCameraPosition);
  const targetPosition = useSelector(getCameraTarget);
  const navigate = useNavigate();

  const [updatePoint] = usePutTrackPointMutation();

  if (!pointToAttach) return null;

  const { point, trackId } = pointToAttach;

  const handleClick = async () => {
    const updatedPoint = {
      ...point,
      trackId,
      position,
      targetPosition,
    };

    await updatePoint(updatedPoint);
    toast.success("Точка успешно «" + point.name + "» привязана");
    navigate("/tracks/" + trackId);
  };

  if (!enabled) return null;

  return (
    <Allow role="Creator,Admin" condition={pointToAttach !== null}>
      <NavigationButton onClick={handleClick} title="Привязать точку">
        <IoIosAttach />
      </NavigationButton>
    </Allow>
  );
};
