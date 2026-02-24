import { Vector3, Box3, Object3D } from "three";
import { Building } from "../../../types/types";
import { modelsCache } from "@utils/modelsCache";
import { useEffect, useState } from "react";
import { ModelData } from "@utils/modelTransform";

interface Props {
  building: Building;
  onClick?: (building: Building) => void;
}

export const ModelBuilding = ({ building, onClick = () => null }: Props) => {
  const { model: modelId, modelMetadata } = building;
  const { position: fbxPosition, rotation, scale } = modelMetadata || {};

  const [modelRef, setModelRef] = useState<Object3D>(null);

  // const fbx = useFBX(minioUrl + normalizeEndpoint(modelUrl!));
  // const fbxPosition = [position.x, 0, position.z];
  const [model, setModel] = useState<ModelData | null>(null);

  useEffect(() => {
    if (modelRef) {
      console.log(modelRef.position);

      console.log({
        position: modelRef.position,
        rotation: modelRef.rotation,
        scale: modelRef.scale,
      });
    }
  }, [modelRef]);

  useEffect(() => {
    const loadModel = async () => {
      if (modelId) {
        try {
          const loadedModel = await modelsCache.getModel(modelId);
          setModel(loadedModel);

          if (loadedModel) {
            console.log(modelId);
            const box = new Box3().setFromObject(loadedModel.modelObject);
            console.log("Model bounds:", box);
            console.log("Model center:", box.getCenter(new Vector3()));
            console.log("Model size:", box.getSize(new Vector3()));

            console.log({ boundingBox: loadedModel.metadata.boundingBox });
          }
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

  // return <primitive object={fbx} position={fbxPosition} />;

  if (!model) return null;

  const rotY = (((rotation && rotation[1]) || 0) * Math.PI) / 180;

  return (
    <mesh onClick={handleClick}>
      <primitive
        ref={setModelRef}
        object={model}
        rotation={[0, rotY, 0]}
        position={fbxPosition}
        scale={scale}
      />
    </mesh>
  );
};
