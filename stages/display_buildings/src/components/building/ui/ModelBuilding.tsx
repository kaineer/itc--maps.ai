import { useEffect, useState } from "react";

import { Building } from "@.types/buildings-types";
import { modelsCache } from "@utils/modelsCache";
import { ModelData } from "@utils/modelTransform";

interface Props {
  building: Building;
  onClick?: (building: Building) => void;
}

export const ModelBuilding = ({ building, onClick = () => null }: Props) => {
  const { model: modelId, modelMetadata } = building;
  const { position, rotation, scale } = modelMetadata || {};

  const [modelObject, setModelObject] = useState<
    ModelData["modelObject"] | null
  >(null);

  useEffect(() => {
    const loadModelObject = async () => {
      if (modelId) {
        try {
          const loadedModel = await modelsCache.getModel(modelId);
          if (loadedModel) {
            setModelObject(loadedModel.modelObject);
          } else {
            setModelObject(null);
          }
        } catch (err) {
          setModelObject(null);
        }
      }
    };

    if (modelId) {
      loadModelObject();
    }
  }, [modelId]);

  const handleClick = () => {
    onClick(building);
  };

  if (!modelObject) return null;

  const rotY = (((rotation && rotation[1]) || 0) * Math.PI) / 180;

  return (
    <primitive
      onClick={handleClick}
      object={modelObject}
      rotation={[0, rotY, 0]}
      position={position}
      scale={[scale, scale, scale]}
    />
  );
};
