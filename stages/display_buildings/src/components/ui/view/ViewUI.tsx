import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { buildingsSlice, fetchInitialBuildings } from "@slices/buildingsSlice";
import { viewSlice } from "@slices/viewSlice";
import { ViewControlsInfo } from "../../cameras/view/ViewControlsInfo";
import { Ground } from "../../static/Ground";
import { Lighting } from "../../static/Lighting";
import { ViewStage } from "../../stage/ui/ViewStage";
import { ViewCameraController } from "../../cameras/view/ViewCameraController";
import { type AppDispatch } from "@store/index";
import { type Building } from "../../../types/types";
import { alignmentSlice } from "@slices/alignmentSlice";

import { BuildingFormsGroup } from "./BuildingFormsGroup";
import { toast } from "sonner";

interface Props {
  // onBuildingSelect?: (buildingId: string) => void;
  onBuildingSelect?: (building: Building) => void;
}

export const ViewUI = ({ onBuildingSelect }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { getBuildings, getError } = buildingsSlice.selectors;
  const { addPolygonForAlignment } = alignmentSlice.actions;
  const { getCameraState } = viewSlice.selectors;

  const buildings = useSelector(getBuildings);
  const error = useSelector(getError);

  const cameraState = useSelector(getCameraState);

  const handleBuildingClick = (building: Building) => {
    dispatch(addPolygonForAlignment(building));
    onBuildingSelect && onBuildingSelect(building);
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

      <Canvas
        camera={{
          position: cameraState.position,
          fov: cameraState.fov,
        }}
        shadows
      >
        <color attach="background" args={["#87CEEB"]} />

        {/* Lighting for the scene */}
        <Lighting />

        {/* Ground plane for reference */}
        <Ground position={cameraState.position} />

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
          target={cameraState.target}
        />

        {/* Camera movement controller (WASD controls) */}
        <ViewCameraController />
      </Canvas>
    </>
  );
};
