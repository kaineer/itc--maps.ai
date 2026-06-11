import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ViewControlsInfo } from "../../../widgets/view/controls-info/ViewControlsInfo";
import { Ground } from "@canvas/static/Ground";
import { Lighting } from "@canvas/static/Lighting";
import { ViewCameraController } from "@canvas/cameras/view/ViewCameraController";
import { type AppDispatch } from "@store/index";
import type { Building } from "../../../types/types";
import { alignmentSlice } from "@slices/alignmentSlice";

import { toast } from "sonner";
import { Minimap } from "./openstreet/Minimap";
import { MarkerNotification } from "./MarkerNotification";

import { ViewSidebar } from "@widgets/view/sidebar/ViewSideBar";
import {
  useViewCamera,
  useViewMarkers,
  useViewMinimap,
} from "@hooks/view/useViewSlice";
import { useBuildingsSlice } from "@entities/buildings/lib/use.buildings.slice";
import { useBuildingsApi } from "@entities/buildings/lib/use.buildings.api";
import { ViewStage } from "@canvas/stages/view/ViewStage";

interface Props {
  // onBuildingSelect?: (buildingId: string) => void;
  onBuildingSelect?: (building: Building) => void;
}

export const ViewUI = ({ onBuildingSelect }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { addPolygonForAlignment, selectModelToEdit } = alignmentSlice.actions;

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
      dispatch(addPolygonForAlignment(building));
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
