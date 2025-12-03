import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  buildingsSlice,
  fetchInitialBuildings,
} from "../../store/buildingsSlice";
import { ViewControlsInfo } from "../cameras/view/ViewControlsInfo";
import { Ground } from "../static/Ground";
import { Lighting } from "../static/Lighting";
import { ViewStage } from "../stage/ui/ViewStage";
import { ViewCameraController } from "../cameras/view/ViewCameraController";
import { type AppDispatch } from "../../store";

interface Props {
  onBuildingSelect?: (buildingId: string) => void;
}

export const ViewUI = ({ onBuildingSelect }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { getBuildings, getLoading, getError } = buildingsSlice.selectors;
  // const {
  //   selectModelForAlignment,
  //   addPolygonForAlignment,
  //   startAlignmentProcess,
  // } = alignmentSlice.actions;

  const buildings = useSelector(getBuildings);
  const loading = useSelector(getLoading);
  const error = useSelector(getError);

  useEffect(() => {
    // Fetch initial position and buildings when component mounts
    dispatch(fetchInitialBuildings());
  }, [dispatch]);

  if (loading) {
    return <div className="loading">Loading 3D buildings visualization...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h3>Error loading buildings</h3>
        <p>{error}</p>
        <p style={{ marginTop: "10px", fontSize: "14px" }}>
          Make sure the backend server is running on localhost:5000
        </p>
      </div>
    );
  }

  return (
    <>
      <ViewControlsInfo enabled={true} />

      <Canvas
        camera={{
          position: [0, 50, 0], // Top view starting position
          fov: 60,
        }}
        shadows
      >
        <color attach="background" args={["#87CEEB"]} />

        {/* Lighting */}
        <Lighting />

        {/* Ground */}
        <Ground />

        {/* Buildings */}
        <ViewStage buildings={buildings} onBuildingClick={onBuildingSelect} />

        {/* Camera controls for view mode */}
        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2} // Prevent going below ground
        />

        {/* Camera movement controller (WASD controls) */}
        <ViewCameraController />
      </Canvas>
    </>
  );
};
