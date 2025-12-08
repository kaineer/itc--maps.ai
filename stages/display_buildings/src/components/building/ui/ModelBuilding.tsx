import { Vector3, Box3 } from "three";
import { Building } from "../../../types/types";
import { useFBX } from "@react-three/drei";
import { minioUrl, normalizeEndpoint } from "../../../utils/network";

interface Props {
  building: Building;
  onClick?: (building: Building) => void;
}

export const ModelBuilding = ({ building, onClick = () => null }: Props) => {
  const { modelUrl, position = { x: 0, z: 0 } } = building;
  const fbx = useFBX(minioUrl + normalizeEndpoint(modelUrl!));
  const fbxPosition = [position.x, 0, position.z];

  const handleClick = () => {
    onClick(building);
  }

  if (fbx) {
    const box = new Box3().setFromObject(fbx);
    console.log("Model bounds:", box);
    console.log("Model center:", box.getCenter(new Vector3()));
    console.log("Model size:", box.getSize(new Vector3()));
  }

  // return <primitive object={fbx} position={fbxPosition} />;
  return (
    <mesh position={new Vector3(position.x, 0, position.z)} onClick={handleClick}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="red" wireframe />
      <primitive object={fbx} position={fbxPosition} />
    </mesh>
  );
};
