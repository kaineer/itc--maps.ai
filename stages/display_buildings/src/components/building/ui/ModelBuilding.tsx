import { Vector3, Box3 } from "three";
import { Building } from "../../../types/types";
import { modelsCache } from "@utils/modelsCache";
import { useEffect, useState } from "react";
import { ModelData } from "@utils/modelTransform";

interface Props {
  building: Building;
  onClick?: (building: Building) => void;
}

export const ModelBuilding = ({ building, onClick = () => null }: Props) => {
  const { model: modelId, modelMetadata = {} } = building;
  const { position: fbxPosition, rotation } = modelMetadata;

  // const fbx = useFBX(minioUrl + normalizeEndpoint(modelUrl!));
  // const fbxPosition = [position.x, 0, position.z];
  const [model, setModel] = useState<ModelData | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      if (modelId) {
        try {
          const loadedModel = await modelsCache.getModel(modelId);
          setModel(loadedModel);
        } catch (err) {
          setModel(null);
        }
      }
    };

    loadModel();
  }, [modelId]);

  const handleClick = () => {
    onClick(building);
  };

  // if (fbx) {
  //   const box = new Box3().setFromObject(fbx);
  //   console.log("Model bounds:", box);
  //   console.log("Model center:", box.getCenter(new Vector3()));
  //   console.log("Model size:", box.getSize(new Vector3()));
  // } else {
  //   return null;
  // }

  // return <primitive object={fbx} position={fbxPosition} />;

  if (!model) return null;

  const rotY = ((rotation[1] || 0) * Math.PI) / 180;

  return (
    <mesh position={new Vector3(...fbxPosition)} onClick={handleClick}>
      <boxGeometry args={[10, 10, 10]} />
      <meshBasicMaterial color="red" wireframe />
      <primitive object={model} rotation={[0, rotY, 0]} />
    </mesh>
  );
};
