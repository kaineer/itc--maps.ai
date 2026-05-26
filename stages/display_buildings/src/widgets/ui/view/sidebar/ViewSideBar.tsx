import { viewSlice } from "@slices/viewSlice";
import { HoveringSideBar } from "@widgets/sidebar/HoveringSideBar";
import { SideBarItem } from "@widgets/sidebar/item/SideBarItem";
import { GoMoveToTop } from "react-icons/go";
import { FaListUl, FaRegBuilding } from "react-icons/fa";
import { AuthSidebarItems } from "@widgets/ui/shared/sidebar/AuthSidebarItems";
import { LuBuilding2 } from "react-icons/lu";

import { useDispatch, useSelector } from "react-redux";
import { useAuthentication } from "@hooks/useAuthentication";
import { SideBarList } from "@widgets/sidebar/list/SideBarList";
import { useEffect, useState } from "react";
import { Track, TrackPoint } from "@.types/track-types";
import { almostNone } from "@components/shared/positionMath";
import { Allow } from "@components/shared/Allow";
import { UserListSidebarItem } from "@widgets/ui/shared/sidebar/UserlistSidebarItem";
import { TracksSidebarItem } from "@widgets/ui/shared/sidebar/TracksSidebarItem";
import { BuildingSelection } from "../forms/selection/BuildingSelection";
import { EditPolygon } from "../forms/polygon/EditPolygon";
import { alignmentSlice } from "@slices/alignmentSlice";
import { Building } from "@.types/buildings-types";
import {
  useGetTracksListQuery,
  useLazyGetTrackPointsQuery,
} from "@entities/tracks/model/tracks.api";

export const ViewSidebar = () => {
  const { isAuthenticated } = useAuthentication();

  const dispatch = useDispatch();
  const { getMinimapEnabled } = viewSlice.selectors;
  const minimapEnabled = useSelector(getMinimapEnabled);
  const {
    enableMinimap,
    disableMinimap,
    updateCameraTarget,
    updateCameraPosition,
    setCameraPreset,
  } = viewSlice.actions;

  const { data: tracksData, isLoading } = useGetTracksListQuery();
  const [requestTrackPoints] = useLazyGetTrackPointsQuery();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [trackPoints, setTrackPoints] = useState<TrackPoint[]>([]);
  const { getSelectedPolygons } = alignmentSlice.selectors;
  const selectedPolygons: Building[] = useSelector(getSelectedPolygons);
  const polygon = selectedPolygons.length === 1 ? selectedPolygons[0] : "";

  useEffect(() => {
    if (!isLoading && tracksData) {
      setTracks(tracksData);
    }
  }, [isLoading, tracksData]);

  const handleToggleMinimap = () => {
    if (minimapEnabled) {
      dispatch(disableMinimap());
    } else {
      dispatch(enableMinimap());
    }
  };

  const handleTrackChoose = async (track: Track) => {
    setCurrentTrack(track);

    const { data: fullTrack, isSuccess } = await requestTrackPoints(track.id);
    if (isSuccess) {
      const { points } = fullTrack;
      setTrackPoints(points);
    }
  };

  const handlePointChoose = async (point: TrackPoint) => {
    if (!almostNone(point.position)) {
      dispatch(setCameraPreset());
      dispatch(updateCameraPosition(point.position));
      dispatch(updateCameraTarget(point.targetPosition));
    }
  };

  return (
    <HoveringSideBar>
      <AuthSidebarItems />
      <SideBarItem
        icon={GoMoveToTop}
        label={minimapEnabled ? "Выключить миникарту" : "Включить миникарту"}
        onClick={handleToggleMinimap}
      />
      <Allow role="Admin">
        <TracksSidebarItem />
        <UserListSidebarItem />
      </Allow>
      <Allow condition={isAuthenticated}>
        <SideBarItem
          icon={LuBuilding2}
          label="Выбранные полигоны"
          form={BuildingSelection}
        />
        <SideBarItem
          icon={LuBuilding2}
          label="Изменить полигон"
          form={EditPolygon}
          displayWhen={() => !!polygon}
        />
        <SideBarList
          icon={FaListUl}
          items={tracks}
          title="Экскурсии"
          getLabel={(track) => track.name}
          onClickItem={handleTrackChoose}
        />
        <SideBarList
          icon={FaRegBuilding}
          title={currentTrack?.name || ""}
          items={trackPoints}
          displayWhen={() =>
            Array.isArray(trackPoints) && currentTrack !== null
          }
          getLabel={(point) => point.name}
          onClickItem={handlePointChoose}
        />
      </Allow>
    </HoveringSideBar>
  );
};
