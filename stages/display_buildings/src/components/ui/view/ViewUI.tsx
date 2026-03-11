import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { buildingsSlice, fetchInitialBuildings } from "@slices/buildingsSlice";
import { viewSlice } from "@slices/viewSlice";
import { ViewControlsInfo } from "../../cameras/view/ViewControlsInfo";
import { Ground } from "../../static/Ground";
import { Lighting } from "../../static/Lighting";
import { ViewCameraController } from "../../cameras/view/ViewCameraController";
import { type AppDispatch } from "@store/index";
import { ModelPosition, type Building } from "../../../types/types";
import { alignmentSlice } from "@slices/alignmentSlice";

import { BuildingFormsGroup } from "./BuildingFormsGroup";
import { toast } from "sonner";
import { ViewStage } from "@components/stage/ui/ViewStage";
import { ViewTopStage } from "@components/stage/ui/ViewTopStage";
import { Match } from "@components/shared/Match";
import { ViewTopCameraController } from "@components/cameras/view/ViewTopCameraController";
import { DummyNotification } from "./DummyNotification";
import { WorldMap } from "./openstreet/WorldMap";

interface Props {
  // onBuildingSelect?: (buildingId: string) => void;
  onBuildingSelect?: (building: Building) => void;
}

export const ViewUI = ({ onBuildingSelect }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { getBuildings, getError } = buildingsSlice.selectors;
  const { addPolygonForAlignment } = alignmentSlice.actions;
  const {
    enableNotification,
    disableNotification,
    enableMinimap,
    disableMinimap,
  } = viewSlice.actions;
  const {
    getViewMode,
    getCameraPosition,
    getCameraTarget,
    getCameraFov,
    getNotificationEnabled,
    getMinimapEnabled,
  } = viewSlice.selectors;

  const buildings = useSelector(getBuildings);
  const error = useSelector(getError);

  const cameraPosition: ModelPosition = useSelector(getCameraPosition);
  const cameraTarget: ModelPosition = useSelector(getCameraTarget);
  const cameraFov = useSelector(getCameraFov);
  const viewMode = useSelector(getViewMode);
  // TODO: убрать нафиг
  const notificationEnabled = useSelector(getNotificationEnabled);
  const showMinimap = useSelector(getMinimapEnabled);

  const handleBuildingClick = (building: Building) => {
    if (building.model) {
      dispatch(enableNotification());
    } else {
      dispatch(addPolygonForAlignment(building));
      onBuildingSelect && onBuildingSelect(building);
    }
  };

  const handleNotificationClose = () => {
    dispatch(disableNotification());
  };

  useEffect(() => {
    // Fetch initial position and buildings when component mounts
    dispatch(fetchInitialBuildings());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(String(error));
    }
  }, [error]);

  if (!buildings) {
    return <div className="loading">Loading 3D buildings visualization...</div>;
  }

  if (error) {
    return null;
  }

  return (
    <>
      <ViewControlsInfo showDetailed={true} />
      <BuildingFormsGroup />

      <DummyNotification
        enabled={notificationEnabled}
        onClose={handleNotificationClose}
      />

      <Canvas
        camera={{
          position: cameraPosition,
          fov: cameraFov,
        }}
        shadows
      >
        <color attach="background" args={["#87CEEB"]} />

        {/* Lighting for the scene */}
        <Lighting />

        {/* Ground plane for reference */}
        <Ground position={cameraPosition} />

        {/* Buildings */}
        <Match
          value={viewMode}
          top={() => (
            <ViewTopStage
              buildings={buildings}
              onBuildingClick={handleBuildingClick}
            />
          )}
          perspective={() => (
            <ViewStage
              buildings={buildings}
              onBuildingClick={handleBuildingClick}
            />
          )}
        />

        {/* Camera controls for view mode */}
        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={false}
          enableRotate={viewMode === "perspective"}
          maxPolarAngle={Math.PI / 2} // Prevent going below ground
          target={cameraTarget}
        />

        {/* Camera movement controller (WASD controls) */}
        <Match
          value={viewMode}
          top={() => <ViewTopCameraController />}
          perspective={() => <ViewCameraController />}
        />
      </Canvas>

      {showMinimap && <WorldMap mapCenter={cameraPosition} />}
    </>
  );
};
