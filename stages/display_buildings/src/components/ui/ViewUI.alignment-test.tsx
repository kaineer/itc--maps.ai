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
    position: { x: -20, z: -20 },
    height: 10,
    area: 100,
  },
  {
    id: "building-2",
    address: "Test Building 2",
    position: { x: 20, z: -20 },
    height: 15,
    area: 150,
  },
  {
    id: "building-3",
    address: "Test Building 3",
    position: { x: 0, z: 20 },
    height: 12,
    area: 120,
  },
];

// Simple test model with box geometry
const TEST_MODEL: ModelData = {
  id: "test-model",
  modelObject: {
    geometry: {
      boundingBox: null,
      computeBoundingBox: function () {
        this.boundingBox = {
          min: { x: -5, y: 0, z: -5 },
          max: { x: 5, y: 10, z: 5 },
          getSize: function (target) {
            target.x = 10;
            target.y = 10;
            target.z = 10;
            return target;
          },
          getCenter: function (target) {
            target.x = 0;
            target.y = 5;
            target.z = 0;
            return target;
          },
        };
      },
    },
  },
  metadata: {
    fileFormat: "test",
    vertexCount: 8,
    boundingBox: {
      min: { x: -5, y: 0, z: -5 },
      max: { x: 5, y: 10, z: 5 },
      getSize: function (target) {
        target.x = 10;
        target.y = 10;
        target.z = 10;
        return target;
      },
      getCenter: function (target) {
        target.x = 0;
        target.y = 5;
        target.z = 0;
        return target;
      },
    },
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
    dispatch(buildingsSlice.actions.setBuildings(TEST_BUILDINGS));

    // Set up alignment system with test data
    dispatch(selectModelForAlignment(TEST_MODEL));

    // Add all test buildings as polygons for alignment
    TEST_BUILDINGS.forEach((building) => {
      dispatch(addPolygonForAlignment(building));
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
        {TEST_BUILDINGS.map((building, index) => (
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
