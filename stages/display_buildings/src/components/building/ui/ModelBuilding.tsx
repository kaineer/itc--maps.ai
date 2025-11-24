import { Vector3, Box3 } from "three";
import { Building } from "../../../types/types";
import { useFBX } from "@react-three/drei";

interface Props {
  building: Building;
}

export const ModelBuilding = ({ building }: Props) => {
  const { modelUrl, position = { x: 0, z: 0 } } = building;
  const fbx = useFBX("http://localhost:5000" + modelUrl!);
  const fbxPosition = [position.x, 0, position.z];

  if (fbx) {
    const box = new Box3().setFromObject(fbx);
    console.log("Model bounds:", box);
    console.log("Model center:", box.getCenter(new Vector3()));
    console.log("Model size:", box.getSize(new Vector3()));
  }

  // return <primitive object={fbx} position={fbxPosition} />;
  return (
    <mesh position={new Vector3(position.x, 0, position.z)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="red" wireframe />
      <primitive object={fbx} position={fbxPosition} />
    </mesh>
  );
};
