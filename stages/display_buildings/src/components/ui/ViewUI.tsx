import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { buildingsSlice } from "../../store/buildingsSlice";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { ControlsInfo } from "../shared/ui/ControlsInfo";
import { Ground } from "../static/Ground";
import { Lighting } from "../static/Lighting";
import { ViewStage } from "../stage/ui/ViewStage";
import { CameraController } from "./CameraController";

import { Building, BuildingNode } from "../../types/types";

interface BuildingsResponse {
  buildings: Building[];
}

interface Props {
  onBuildingSelect?: (buildingId: string) => void;
}

const ITC_CENTER = { x: -326.31, z: 668.04 };

export const ViewUI = ({ onBuildingSelect }: Props) => {
  const dispatch = useDispatch();
  const { getBuildings, getLoading, getError } = buildingsSlice.selectors;
  const buildings = useSelector(getBuildings);
  const loading = useSelector(getLoading);
  const error = useSelector(getError);

  useEffect(() => {
    dispatch(
      buildingsSlice.actions.fetchBuildings({
        position: ITC_CENTER,
        distance: 500,
      }),
    );
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
          position: [ITC_CENTER.x, 1.8, ITC_CENTER.z + 10],
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

        {/* ITC Center Marker */}
        <mesh position={[ITC_CENTER.x, 5, ITC_CENTER.z]}>
          <sphereGeometry args={[3, 16, 16]} />
          <meshStandardMaterial color="#FF0000" />
        </mesh>
        <Text
          position={[ITC_CENTER.x, 15, ITC_CENTER.z]}
          fontSize={8}
          color="#FF0000"
          anchorX="center"
          anchorY="middle"
        >
          ITC Center
        </Text>

        {/* Controls */}
        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[ITC_CENTER.x, 1.8, ITC_CENTER.z]}
        />

        {/* Camera Controller for WASD movement */}
        <CameraController />
      </Canvas>
    </>
  );
};
