import { ModelPosition } from "@.types/buildings-types";
import { Cone, Cylinder } from "@react-three/drei";
import { DoubleSide, MathUtils, Vector3 } from "three";

interface Props {
  position: ModelPosition;
  target: ModelPosition;
  radius?: number;
  height?: number;
  color?: string;
}

export const TrackPointMarker = ({
  position,
  target,
  radius = 2.5,
  height = 0.5,
  color = "#1e2a2e",
}: Props) => {
  const [x, _, z] = position;
  const [tx, _2, tz] = target;

  const handleClick = () => {
    console.log({ position });
  };

  // Вычисляем направление от position к target
  const direction = new Vector3(x - tx, 0, tz - z);
  const angle = Math.atan2(direction.x, direction.z);

  // Ограничиваем сектор, если дистанция меньше радиуса сектора
  const actualSectorRadius = 15;
  // const sectorAngle = 30;

  return (
    <group position={[-x, 0, z]}>
      {/* Основной цилиндр */}
      <Cylinder
        args={[radius, radius, height, 32]}
        position={[0, 0, 0]}
        onClick={handleClick}
      >
        <meshStandardMaterial transparent color={color} opacity={0.3} />
      </Cylinder>

      {/* Сектор направления */}
      <group rotation={[0, angle, 0]}>
        {/* Основная ось направления - яркая линия */}
        <mesh position={[0, height * 0.5, actualSectorRadius / 2]}>
          <boxGeometry args={[0.1, 0.1, actualSectorRadius]} />
          <meshStandardMaterial
            color="#f00"
            emissive={color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.9}
          />
        </mesh>
      </group>
    </group>
  );
};
