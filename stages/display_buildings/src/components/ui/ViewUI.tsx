import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Canvas } from "@react-three/fiber";
import {
  buildingsSlice,
  fetchInitialBuildings,
} from "../../store/buildingsSlice";
import { ControlsInfo } from "../shared/ui/ControlsInfo";
import { Ground } from "../static/Ground";
import { Lighting } from "../static/Lighting";
import { ViewStage } from "../stage/ui/ViewStage";
import { AlignmentCameraGroup } from "../cameras/alignment/AlignmentCameraGroup";
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
      <ControlsInfo />

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

        {/* Camera Controller for alignment */}
        <AlignmentCameraGroup enabled={true} />
      </Canvas>
    </>
  );
};
