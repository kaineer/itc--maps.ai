import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";

import type { Building } from "@shared/model/buildings-types";
import { modelsCache } from "@entities/models";
import { ModelData } from "@entities/models";
import {
  getKeyboardModifiers,
  type KeyboardModifiers,
} from "@shared/lib/keyboardModifiers";
import { useNotification } from "@shared/lib/useNotification";

interface Props {
  building: Building;
  onClick?: (building: Building, keys: KeyboardModifiers) => void;
}

const describeMaterial = (material: THREE.Material | undefined) => {
  if (!material) return "material: (none)";

  const lines = [
    `material: ${material.name || "(unnamed)"}`,
    `type: ${material.type}`,
  ];

  const colored = material as THREE.MeshPhongMaterial;
  if (colored.color) {
    lines.push(`color: #${colored.color.getHexString()}`);
  }

  if ("map" in material) {
    const map = (material as THREE.MeshPhongMaterial).map;
    if (!map) {
      lines.push("texture: не используется (map = null)");
    } else {
      const img = map.image as
        | {
            width?: number;
            height?: number;
            naturalWidth?: number;
            naturalHeight?: number;
            src?: string;
            complete?: boolean;
          }
        | undefined;

      const width = img?.naturalWidth || img?.width || 0;
      const height = img?.naturalHeight || img?.height || 0;
      const hasPixels = width > 0 && height > 0;
      const isComplete =
        typeof img?.complete === "boolean" ? img.complete : hasPixels;
      const loaded = Boolean(img) && isComplete && hasPixels;

      if (!img) {
        lines.push("texture: назначена, но image ещё нет (не подгружена)");
      } else if (!loaded) {
        lines.push(
          `texture: назначена, загрузка не завершена (complete=${String(img.complete)}, ${width}×${height})`,
        );
      } else {
        const src = img.src ? String(img.src).slice(0, 48) : "(no src)";
        const kind = src.startsWith("blob:")
          ? "embedded/blob"
          : src.startsWith("data:")
            ? "embedded/data"
            : "external";
        lines.push(`texture: используется и загружена (${width}×${height}, ${kind})`);
        lines.push(`texture src: ${src}`);
      }
    }
  } else {
    lines.push("texture: поле map отсутствует у материала");
  }

  if ("metalness" in material) {
    lines.push(`metalness: ${(material as THREE.MeshStandardMaterial).metalness}`);
  }
  if ("roughness" in material) {
    lines.push(`roughness: ${(material as THREE.MeshStandardMaterial).roughness}`);
  }

  return lines.join("\n");
};

export const ModelBuilding = ({ building, onClick = () => null }: Props) => {
  const { model: modelId, modelMetadata } = building;
  const { position, rotation, scale } = modelMetadata || {};
  const { info } = useNotification();

  const [modelObject, setModelObject] = useState<
    ModelData["modelObject"] | null
  >(null);
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

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();

    const mesh = e.object;
    const face = e.face;
    const uv = e.uv;
    const point = e.point;

    let material: THREE.Material | undefined;
    if (mesh instanceof THREE.Mesh) {
      const mats = mesh.material;
      if (Array.isArray(mats)) {
        const index = face?.materialIndex ?? 0;
        material = mats[index];
      } else {
        material = mats;
      }
    }

    const geometry =
      mesh instanceof THREE.Mesh ? mesh.geometry : undefined;
    const hasUvAttr = Boolean(geometry?.attributes?.uv);

    const title = mesh.name || material?.name || "Поверхность модели";
    const description = [
      `mesh: ${mesh.name || "(unnamed)"}`,
      describeMaterial(material),
      `uv attr: ${hasUvAttr ? "yes" : "no"}`,
      uv ? `uv click: (${uv.x.toFixed(3)}, ${uv.y.toFixed(3)})` : "uv click: n/a",
      face
        ? `face: ${e.faceIndex ?? "?"}, materialIndex: ${face.materialIndex ?? 0}`
        : "face: n/a",
      point
        ? `point: (${point.x.toFixed(1)}, ${point.y.toFixed(1)}, ${point.z.toFixed(1)})`
        : "point: n/a",
    ].join("\n");

    info(title, {
      description: (
        <pre
          style={{
            margin: 0,
            fontSize: 12,
            lineHeight: 1.35,
            whiteSpace: "pre-wrap",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {description}
        </pre>
      ),
      duration: 15000,
    });

    onClick(building, getKeyboardModifiers(e));
  };

  const rotY = (((rotation && rotation[1]) || 0) * Math.PI) / 180;

  if (!modelObject) return null;

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
