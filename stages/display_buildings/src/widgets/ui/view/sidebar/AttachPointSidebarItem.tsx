import { SideBarItem } from "@widgets/sidebar/item/SideBarItem";
import { useViewCamera, useViewMarkers } from "@hooks/view/useViewSlice";
import { useTrackPointsApi } from "@entities/tracks/lib/use.tracks.api";
import { useNotification } from "@hooks/useNotification";
import { useNavigate } from "react-router";
import { IoIosAttach } from "react-icons/io";

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
