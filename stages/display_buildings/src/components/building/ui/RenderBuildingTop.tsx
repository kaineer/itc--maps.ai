import { Building } from "@.types/buildings-types";
import { useEffect, useMemo, useRef } from "react";
import {
  Box3,
  DoubleSide,
  Mesh,
  Shape,
  ShapeGeometry,
  Vector2,
  Vector3,
} from "three";

interface Props {
  building: Building;
  onBuildingClick: (building: Building) => void;
}

export const RenderBuildingTop = ({
  building,
  onBuildingClick = () => null,
}: Props) => {
  // const color = "#4a90e2";
  const color = "#f00";
  const meshRef = useRef<Mesh>(null);

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

  // Вычисляем и выводим информацию о bounding box
  useEffect(() => {
    if (geometry && meshRef.current) {
      const mesh = meshRef.current;

      // Получаем мировую матрицу mesh
      mesh.updateWorldMatrix(true, false);

      // Создаем временный bounding box
      const bbox = new Box3().setFromObject(mesh);

      // Получаем центр в мировых координатах
      const center = new Vector3();
      bbox.getCenter(center);

      // Получаем углы bounding box
      const min = bbox.min;
      const max = bbox.max;

      console.log("=== Анализ mesh после трансформаций ===");
      console.log(
        "📊 Позиция mesh (локальная):",
        `(${mesh.position.x.toFixed(2)}, ${mesh.position.y.toFixed(2)}, ${mesh.position.z.toFixed(2)})`,
      );

      console.log(
        "🔄 Поворот mesh (радианы):",
        `(${mesh.rotation.x.toFixed(2)}, ${mesh.rotation.y.toFixed(2)}, ${mesh.rotation.z.toFixed(2)})`,
      );

      console.log("📐 Bounding Box (мировые координаты):");
      console.log(
        "  Min:",
        `(${min.x.toFixed(2)}, ${min.y.toFixed(2)}, ${min.z.toFixed(2)})`,
      );
      console.log(
        "  Max:",
        `(${max.x.toFixed(2)}, ${max.y.toFixed(2)}, ${max.z.toFixed(2)})`,
      );
      console.log(
        "  Center:",
        `(${center.x.toFixed(2)}, ${center.y.toFixed(2)}, ${center.z.toFixed(2)})`,
      );

      // Получаем несколько ключевых точек в мировых координатах
      const worldPoints = [];

      // Берем первые 5 вершин из геометрии (если они есть)
      if (mesh.geometry.attributes.position) {
        const positions = mesh.geometry.attributes.position.array;
        const count = Math.min(5, positions.length / 3);

        console.log(`🔍 Первые ${count} вершин в МИРОВЫХ координатах:`);

        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          // Создаем локальную точку из геометрии
          const localPoint = new Vector3(
            positions[idx],
            positions[idx + 1],
            positions[idx + 2],
          );

          // Преобразуем в мировые координаты
          const worldPoint = localPoint.clone().applyMatrix4(mesh.matrixWorld);

          console.log(
            `  Вершина ${i}: локальная (${localPoint.x.toFixed(2)}, ${localPoint.y.toFixed(2)}, ${localPoint.z.toFixed(2)}) -> мировая (${worldPoint.x.toFixed(2)}, ${worldPoint.y.toFixed(2)}, ${worldPoint.z.toFixed(2)})`,
          );

          worldPoints.push(worldPoint);
        }

        // Проверяем расстояние от камеры (если знаем позицию камеры)
        // Но это сложно получить напрямую, поэтому просто дадим рекомендацию
        console.log(
          "👀 Расстояние от центра сцены (0,0,0) до центра здания:",
          center.length().toFixed(2),
        );

        if (center.length() > 50) {
          console.log(
            "⚠️ Здание далеко от центра! Попробуйте приблизить камеру или переместить камеру в эту точку",
          );
        }
      }

      console.log("=====================================");
    }
  }, [geometry]);

  if (!geometry) return null;

  return (
    <mesh
      geometry={geometry}
      ref={meshRef}
      position={[0, 0.5, 0]}
      rotation={[-Math.PI / 2, 0, 0]} // Поворачиваем, чтобы многоугольник лежал горизонтально
      onClick={() => onBuildingClick(building)}
    >
      <meshStandardMaterial
        color={color}
        side={DoubleSide} // Отрисовываем с обеих сторон
        emissive="#000000"
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
};
