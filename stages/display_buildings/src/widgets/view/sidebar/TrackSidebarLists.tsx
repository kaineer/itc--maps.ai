import type { Track, TrackPoint } from "@entities/tracks";
import { almostNone } from "@shared/lib/position/positionMath";
import {
  useTracksApi,
  useLazyGetTrackPointsQuery,
} from "@entities/tracks";
import { SideBarList } from "@features/app-chrome";
import { viewSlice } from "@features/explore-view";
import { useState } from "react";
import { FaListUl, FaRegBuilding } from "react-icons/fa";
import { useDispatch } from "react-redux";

export const TracksSidebarLists = () => {
  const { tracks } = useTracksApi();
  const [requestTrackPoints] = useLazyGetTrackPointsQuery();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [trackPoints, setTrackPoints] = useState<TrackPoint[]>([]);
  const dispatch = useDispatch();
  const { setCameraPreset, updateCameraPosition, updateCameraTarget } =
    viewSlice.actions;

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
    <>
      <SideBarList
        icon={FaListUl}
        items={tracks || []}
        title="Экскурсии"
        getLabel={(track) => track.name}
        onClickItem={handleTrackChoose}
      />
      <SideBarList
        icon={FaRegBuilding}
        title={currentTrack?.name || ""}
        items={trackPoints}
        displayWhen={() => Array.isArray(trackPoints) && currentTrack !== null}
        getLabel={(point) => point.name}
        onClickItem={handlePointChoose}
      />
    </>
  );
};
