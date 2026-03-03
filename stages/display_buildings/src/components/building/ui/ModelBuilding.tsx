import { useEffect, useState, useRef } from "react";
import { Box3 } from "three";

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
  const [adjustedPosition, setAdjustedPosition] = useState<
    [number, number, number] | undefined
  >(undefined);
  const positionRef = useRef<[number, number, number] | undefined>(position);
  const scaleRef = useRef<number | undefined>(scale);
  const modelObjectRef = useRef<ModelData["modelObject"] | null>(null);

  useEffect(() => {
    // Update refs when position or scale changes
    positionRef.current = position;
    scaleRef.current = scale;
  }, [position, scale]);

  useEffect(() => {
    const loadModelObject = async () => {
      if (modelId) {
        try {
          const loadedModel = await modelsCache.getModel(modelId);
          if (loadedModel) {
            setModelObject(loadedModel.modelObject);
            modelObjectRef.current = loadedModel.modelObject;

            // Temporary hack: calculate adjusted position based on model bbox
            calculateAndSetAdjustedPosition(loadedModel.modelObject);
          } else {
            setModelObject(null);
            setAdjustedPosition(positionRef.current);
          }
        } catch (err) {
          setModelObject(null);
          setAdjustedPosition(positionRef.current);
        }
      }
    };

    if (modelId) {
      loadModelObject();
    }
  }, [modelId]);

  // Recalculate adjusted position when position or scale changes
  useEffect(() => {
    if (modelObjectRef.current) {
      calculateAndSetAdjustedPosition(modelObjectRef.current);
    }
  }, [position, scale]);

  const handleClick = () => {
    onClick(building);
  };

  // Helper function to calculate adjusted position
  const calculateAndSetAdjustedPosition = (
    modelObj: ModelData["modelObject"],
  ) => {
    const currentPosition = positionRef.current;
    const currentScale = scaleRef.current;

    if (currentPosition) {
      try {
        // Calculate bounding box for the model
        const bbox = new Box3().setFromObject(modelObj);

        // Calculate scale factor (use the scale from metadata)
        const modelScale = currentScale || 1;

        // Calculate the minimum Y value in world coordinates after scaling
        const minY = bbox.min.y * modelScale;

        // Calculate yOffset to place bottom of model at ground level (y=0)
        const yOffset = -minY;

        // Set adjusted position with corrected Y coordinate
        setAdjustedPosition([currentPosition[0], yOffset, currentPosition[2]]);
      } catch (error) {
        setAdjustedPosition(currentPosition);
      }
    } else {
      setAdjustedPosition(currentPosition);
    }
  };

  const rotY = (((rotation && rotation[1]) || 0) * Math.PI) / 180;
  const finalPosition = adjustedPosition || positionRef.current;

  if (!modelObject) return null;

  return (
    <primitive
      onClick={handleClick}
      object={modelObject}
      rotation={[0, rotY, 0]}
      position={finalPosition}
      scale={[scale, scale, scale]}
    />
  );
};
