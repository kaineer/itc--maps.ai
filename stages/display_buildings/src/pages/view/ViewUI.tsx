import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ViewControlsInfo } from "../../widgets/view/controls-info/ViewControlsInfo";
import { Ground } from "@canvas/static/Ground";
import { Lighting } from "@canvas/static/Lighting";
import { ViewCameraController } from "@features/explore-view";
import { type AppDispatch } from "@store/index";
import type { Building } from "@entities/buildings";
import { alignmentSlice } from "@features/align-model";

import { toast } from "sonner";
import { Minimap } from "../../widgets/view/minimap/Minimap";
import { MarkerNotification } from "@widgets/view/notifications/MarkerNotification";

import { ViewSidebar } from "@widgets/view/sidebar/ViewSideBar";
import {
  useViewCamera,
  useViewMarkers,
  useViewMinimap,
} from "@features/explore-view";
import { useBuildingsSlice, useBuildingsApi } from "@entities/buildings";
import { ViewStage } from "@widgets/view/scene/ViewStage";

interface Props {
  // onBuildingSelect?: (buildingId: string) => void;
  onBuildingSelect?: (building: Building) => void;
}

export const ViewUI = ({ onBuildingSelect }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { togglePolygonForAlignment, selectModelToEdit } =
    alignmentSlice.actions;

  const { buildings, error } = useBuildingsSlice();
  const { pointToAttach } = useViewMarkers();

  const { cameraPosition, cameraTarget, cameraFov } = useViewCamera();
  const { initializeBuildings } = useBuildingsApi();

  const { minimapEnabled: showMinimap } = useViewMinimap();

  const handleBuildingClick = (
    building: Building /* , keys: KeyboardModifiers */,
  ) => {
    if (building.model) {
      dispatch(selectModelToEdit(building));
    } else {
      dispatch(togglePolygonForAlignment(building));
      onBuildingSelect && onBuildingSelect(building);
    }
  };

  useEffect(() => {
    if (!pointToAttach) {
      initializeBuildings();
    }
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
      {/*
       */}

      <Canvas
        camera={{
          position: cameraPosition,
          fov: cameraFov,
        }}
        shadows
      >
        <color attach="background" args={["#87CEEB"]} />

        {/* Lighting for the scene
         */}
        <Lighting />

        {/* Ground plane for reference
         */}
        <Ground position={cameraPosition} />

        {/* Buildings
         */}
        <ViewStage
          buildings={buildings}
          onBuildingClick={handleBuildingClick}
        />

        {/* Camera controls for view mode
         */}
        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={false}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2} // Prevent going below ground
          target={cameraTarget}
        />

        {/* Camera movement controller (WASD controls)
         */}
        <ViewCameraController />
      </Canvas>

      {/*
       */}
      {showMinimap && <Minimap mapCenter={cameraPosition} />}
    </>
  );
};
