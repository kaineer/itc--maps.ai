import { Building } from "@.types/buildings-types";
import { useEffect, useMemo, useRef, useState } from "react";
import { DoubleSide, Mesh, Shape, ShapeGeometry, Vector2 } from "three";
import { ModelBuilding } from "../view/ModelBuilding";
import { UI_COLORS } from "@utils/constants";

interface Props {
  building: Building;
  onBuildingClick: (building: Building, ctrlKey: boolean) => void;
}

export const RenderBuildingTop = ({
  building,
  onBuildingClick = () => null,
}: Props) => {
  const color = UI_COLORS.BUILDING;
  const meshRef = useRef<Mesh>(null);

  const [opacity, setOpacity] = useState<number>(0.1);

  useEffect(() => {
    if (opacity < 0.99) {
      setTimeout(() => {
        const nextOpacity = 1 - (1 - opacity) / 2;
        if (nextOpacity >= 0.99) {
          setOpacity(1);
        } else {
          setOpacity(nextOpacity);
        }
      }, 300);
    }
  }, [opacity]);

  // Создаем геометрию на основе узлов здания
  const geometry = useMemo(() => {
    if (!building.nodes || building.nodes.length < 4) {
      return null;
    }

    // Создаем форму многоугольника из точек
    const shape = new Shape();

    // Берем точки из nodes (предполагаем, что последняя точка совпадает с первой)
    const points = building.nodes.map((node) => new Vector2(node.x, -node.z));

    // Начинаем с первой точки
    shape.moveTo(points[0].x, points[0].y);

    // Добавляем остальные точки (кроме последней, если она дублирует первую)
    const pointsToDraw =
      building.nodes[building.nodes.length - 1].x === building.nodes[0].x &&
      building.nodes[building.nodes.length - 1].z === building.nodes[0].z
        ? points.slice(0, -1)
        : points;

    for (let i = 1; i < pointsToDraw.length; i++) {
      shape.lineTo(pointsToDraw[i].x, pointsToDraw[i].y);
    }

    // Замыкаем форму
    shape.closePath();

    // Создаем геометрию экструзией или используем ShapeGeometry для плоской поверхности
    return new ShapeGeometry(shape);
  }, [building.nodes]);

  if (!building.nodes)
    return <ModelBuilding building={building} onClick={onBuildingClick} />;

  return (
    <mesh
      geometry={geometry}
      ref={meshRef}
      position={[0, 0.5, 0]}
      rotation={[-Math.PI / 2, 0, 0]} // Поворачиваем, чтобы многоугольник лежал горизонтально
      onClick={onBuildingClick}
    >
      <meshStandardMaterial
        color={color}
        transparent={opacity < 0.99}
        side={DoubleSide} // Отрисовываем с обеих сторон
        emissive="#000000"
        opacity={opacity}
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
};
