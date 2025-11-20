import React from "react";

const Lighting: React.FC = () => {
  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={0.4} />

      {/* Directional Light */}
      <directionalLight
        position={[100, 200, 100]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={1000}
        shadow-camera-left={-500}
        shadow-camera-right={500}
        shadow-camera-top={500}
        shadow-camera-bottom={-500}
      />
    </>
  );
};

export default Lighting;
