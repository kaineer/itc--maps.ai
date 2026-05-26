import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ViewControlsInfo } from "../../cameras/view/ViewControlsInfo";
import { Ground } from "../../static/Ground";
import { Lighting } from "../../static/Lighting";
import { ViewCameraController } from "../../cameras/view/ViewCameraController";
import { type AppDispatch } from "@store/index";
import type { Building } from "../../../types/types";
import { alignmentSlice } from "@slices/alignmentSlice";

import { toast } from "sonner";
import { ViewStage } from "@components/stage/ui/ViewStage";
import { Minimap } from "./openstreet/Minimap";
import { MarkerNotification } from "./MarkerNotification";

import { ViewSidebar } from "@widgets/ui/view/sidebar/ViewSideBar";
import { useViewCamera, useViewMinimap } from "@hooks/useViewSlice";
import { useBuildingsSlice } from "@entities/buildings/lib/use.buildings.slice";
import { useBuildingsApi } from "@entities/buildings/lib/use.buildings.api";

interface Props {
  // onBuildingSelect?: (buildingId: string) => void;
  onBuildingSelect?: (building: Building) => void;
}

export const ViewUI = ({ onBuildingSelect }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { addPolygonForAlignment, selectModelToEdit } = alignmentSlice.actions;

  const { buildings, error } = useBuildingsSlice();

  const { cameraPosition, cameraTarget, cameraFov } = useViewCamera();
  const { initializeBuildings } = useBuildingsApi();

  const { minimapEnabled: showMinimap } = useViewMinimap();

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
    initializeBuildings();
  }, []);

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

      <ViewSidebar />

      <MarkerNotification />

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

      {showMinimap && <Minimap mapCenter={cameraPosition} />}
    </>
  );
};
