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
import { alignmentSlice, saveMetadata } from "@slices/alignmentSlice";

import { BuildingFormsGroup } from "./BuildingFormsGroup";
import { toast } from "sonner";
import { ViewStage } from "@components/stage/ui/ViewStage";
import { DummyNotification } from "./DummyNotification";
import { WorldMap } from "./openstreet/WorldMap";
import { KeyboardModifiers } from "@utils/keyboardModifiers";

interface Props {
  // onBuildingSelect?: (buildingId: string) => void;
  onBuildingSelect?: (building: Building) => void;
}

export const ViewUI = ({ onBuildingSelect }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { getBuildings, getError } = buildingsSlice.selectors;
  const { addPolygonForAlignment, selectModelToEdit } = alignmentSlice.actions;
  const { enableNotification, disableNotification } = viewSlice.actions;
  const {
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
  // TODO: убрать нафиг
  const notificationEnabled = useSelector(getNotificationEnabled);
  const showMinimap = useSelector(getMinimapEnabled);

  const handleBuildingClick = (
    building: Building /* , keys: KeyboardModifiers */,
  ) => {
    if (building.model) {
      dispatch(selectModelToEdit(building));
    } else {
      dispatch(addPolygonForAlignment(building));
      onBuildingSelect && onBuildingSelect(building);
    }
  };

  const handleNotificationClose = () => {
    // dispatch(disableNotification());
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
        <ViewStage
          buildings={buildings}
          onBuildingClick={handleBuildingClick}
        />

        {/* Camera controls for view mode */}
        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={false}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2} // Prevent going below ground
          target={cameraTarget}
        />

        {/* Camera movement controller (WASD controls) */}
        <ViewCameraController />
      </Canvas>

      {showMinimap && <WorldMap mapCenter={cameraPosition} />}
    </>
  );
};
