export const DEFAULT_AMBIENT_INTENSITY = 3;
export const DEFAULT_AMBIENT_COLOR = "#ffffff";

interface Props {
  ambientIntensity?: number;
  ambientColor?: string;
}

export const Lighting = ({
  ambientIntensity = DEFAULT_AMBIENT_INTENSITY,
  ambientColor = DEFAULT_AMBIENT_COLOR,
}: Props) => {
  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={ambientIntensity} color={ambientColor} />

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
