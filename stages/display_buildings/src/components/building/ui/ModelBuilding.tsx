import { useEffect, useState, useRef } from "react";

import { Building } from "@.types/buildings-types";
import { modelsCache } from "@utils/modelsCache";
import { ModelData } from "@utils/modelTransform";

interface Props {
  building: Building;
  onClick?: (building: Building, ctrlKey: boolean) => void;
}

export const ModelBuilding = ({ building, onClick = () => null }: Props) => {
  const { model: modelId, modelMetadata } = building;
  const { position, rotation, scale } = modelMetadata || {};

  const [modelObject, setModelObject] = useState<
    ModelData["modelObject"] | null
  >(null);
  const positionRef = useRef<[number, number, number] | undefined>(position);
  const modelObjectRef = useRef<ModelData["modelObject"] | null>(null);

  useEffect(() => {
    const loadModelObject = async () => {
      if (modelId) {
        try {
          const loadedModel = await modelsCache.getModel(modelId);
          if (loadedModel) {
            setModelObject(loadedModel.modelObject);
            modelObjectRef.current = loadedModel.modelObject;
          } else {
            setModelObject(null);
          }
        } catch (err) {
          console.error(
            `❌ ModelBuilding: Error loading model ${modelId}:`,
            err,
          );
          setModelObject(null);
        }
      }
    };

    if (modelId) {
      console.log(`📥 ModelBuilding: Loading model ${modelId}...`);
      loadModelObject();
    }
  }, [modelId]);

  const handleClick = (e: any) => {
    onClick(building, e.ctrlKey);
  };

  const rotY = (((rotation && rotation[1]) || 0) * Math.PI) / 180;

  if (!modelObject) return null;

  return (
    <primitive
      onClick={handleClick}
      object={modelObject}
      rotation={[0, rotY, 0]}
      position={positionRef.current}
      scale={[scale, scale, scale]}
    />
  );
};
