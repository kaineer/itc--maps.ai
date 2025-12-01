import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { buildingsSlice } from "../../store/buildingsSlice";
import { alignmentSlice } from "../../store/alignmentSlice";
import { Text } from "@react-three/drei";
import { ControlsInfo } from "../shared/ui/ControlsInfo";
import { Ground } from "../static/Ground";
import { Lighting } from "../static/Lighting";
import { ViewStage } from "../stage/ui/ViewStage";
import { TopCameraController } from "../cameras/alignment/TopCameraController";
import { ModelData } from "../../utils/modelTransform";

interface Props {
  onBuildingSelect?: (buildingId: string) => void;
}

// Test data - simple buildings around origin
const TEST_BUILDINGS = [
  {
    id: "building-1",
    address: "Test Building 1",
    nodes: [
      { x: -25, z: -25 },
      { x: -15, z: -25 },
      { x: -15, z: -15 },
      { x: -25, z: -15 },
    ],
    height: 10,
    position: { x: -20, z: -20 },
  },
  {
    id: "building-2",
    address: "Test Building 2",
    nodes: [
      { x: 15, z: -25 },
      { x: 25, z: -25 },
      { x: 25, z: -15 },
      { x: 15, z: -15 },
    ],
    height: 15,
    position: { x: 20, z: -20 },
  },
  {
    id: "building-3",
    address: "Test Building 3",
    nodes: [
      { x: -5, z: 15 },
      { x: 5, z: 15 },
      { x: 5, z: 25 },
      { x: -5, z: 25 },
    ],
    height: 12,
    position: { x: 0, z: 20 },
  },
];

// Simple test model - use null modelObject to trigger fallback in calculateModelBoundingBox
const TEST_MODEL: ModelData = {
  id: "test-model",
  modelObject: null,
  metadata: {
    fileFormat: "test",
    vertexCount: 8,
    boundingBox: undefined,
  },
};

export const ViewUI = ({ onBuildingSelect }: Props) => {
  const dispatch = useDispatch();
  const { getBuildings, getLoading, getError } = buildingsSlice.selectors;
  const {
    selectModelForAlignment,
    addPolygonForAlignment,
    startAlignmentProcess,
  } = alignmentSlice.actions;

  const buildings = useSelector(getBuildings);
  const loading = useSelector(getLoading);
  const error = useSelector(getError);

  useEffect(() => {
    // Instead of fetching from API, use test data
    dispatch(buildingsSlice.actions.setBuildings(TEST_BUILDINGS as any));

    // Set up alignment system with test data
    dispatch(selectModelForAlignment(TEST_MODEL));

    // Add all test buildings as polygons for alignment
    TEST_BUILDINGS.forEach((building) => {
      dispatch(addPolygonForAlignment(building as any));
    });

    // Start the alignment process
    dispatch(startAlignmentProcess());
  }, [
    dispatch,
    selectModelForAlignment,
    addPolygonForAlignment,
    startAlignmentProcess,
  ]);

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

        {/* Test model visualization (placeholder cube) */}
        <mesh position={[0, 5, 0]}>
          <boxGeometry args={[10, 10, 10]} />
          <meshStandardMaterial color="#00FF00" />
        </mesh>

        {/* Test building markers */}
        {TEST_BUILDINGS.map((building) => (
          <mesh
            key={building.id}
            position={[building.position.x, 0.1, building.position.z]}
          >
            <boxGeometry args={[15, 0.2, 15]} />
            <meshBasicMaterial color="#3b82f6" opacity={0.3} transparent />
          </mesh>
        ))}

        {/* Camera Controller for alignment */}
        <TopCameraController enabled={true} />

        {/* Status text */}
        <Text
          position={[0, 25, 0]}
          fontSize={4}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          Alignment Test - Top View
        </Text>
      </Canvas>
    </>
  );
};
