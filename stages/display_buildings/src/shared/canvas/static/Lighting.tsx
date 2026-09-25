export const Lighting = () => {
  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={3} color="#ffffff" />

      {/* Directional Light */}
      <directionalLight
        position={[100, 200, 100]}
        intensity={0.8}
        color="#ffffff"
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
