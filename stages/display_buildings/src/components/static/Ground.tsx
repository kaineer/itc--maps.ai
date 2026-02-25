import { ModelPosition } from "src/types/types";

interface Props {
  position: ModelPosition;
}

export const Ground = ({ position }: Props) => {
  const [x, _, z] = position;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.1, z]} receiveShadow>
      <planeGeometry args={[2000, 2000]} />
      <meshStandardMaterial color="#90EE90" />
    </mesh>
  );
};
