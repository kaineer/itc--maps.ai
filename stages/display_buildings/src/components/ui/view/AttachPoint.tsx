import { NavigationButton } from "@components/kit/NavigationButton";
import { Allow } from "@components/shared/Allow";
import { usePutTrackPointMutation } from "@entities/tracks/model/tracks.api";
import { useViewCamera, useViewMarkers } from "@hooks/useViewSlice";
import { IoIosAttach } from "react-icons/io";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface Props {
  enabled?: boolean;
}

export const AttachPoint = ({ enabled = true }: Props) => {
  const { cameraPosition: position, cameraTarget: targetPosition } =
    useViewCamera();

  const { pointToAttach } = useViewMarkers();

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
