import { useViewCamera, useViewMarkers } from "@features/explore-view";
import { useTrackPointsApi } from "@entities/tracks";
import { useNotification } from "@shared/lib/useNotification";
import { useNavigate } from "react-router";
import { IoIosAttach } from "react-icons/io";
import { SideBarItem } from "@features/app-chrome";

export const AttachPointSidebarItem = () => {
  const { pointToAttach } = useViewMarkers();
  const { updatePoint } = useTrackPointsApi(pointToAttach?.trackId);
  const { cameraPosition: position, cameraTarget: targetPosition } =
    useViewCamera();
  const { notify } = useNotification();
  const navigate = useNavigate();

  if (!pointToAttach) return null;

  const { point, trackId } = pointToAttach;

  const attachPoint = async () => {
    try {
      await updatePoint({
        ...point,
        position,
        targetPosition,
      });
      notify("Точка успешно «" + point.name + "» привязана");
      navigate("/tracks/" + trackId);
    } catch (err) {
      notify("Не удалось привязать точку", err || new Error());
    }
  };

  return (
    <SideBarItem
      onClick={attachPoint}
      label={`Привязать ${point.name}`}
      icon={IoIosAttach}
    />
  );
};
