// NOTE: мне бы хотелось, чтобы эта штука никогда не пригодилась
//   но увы
export type BuildingId = string;
export type ModelId = string;

export interface Rotation {
  rotX: number;
  rotY: number;
  rotZ: number;
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

export type Scale = number;

export interface BuildingNode {
  x: number;
  z: number;
}

export interface ModelMetadata {
  position: ModelPosition;
  rotation: ModelPosition;
  scale: number;
}

export interface UpdateModel extends Omit<ModelMetadata, "rotation"> {
  id: ModelId;
  rotation: number;
  polygons: BuildingId[];
  address?: string;
}

export interface CreateModel extends ModelMetadata {
  id: ModelId;
  polygons: BuildingId[];
  address?: string;
}

interface BuildingWithModel extends ModelMetadata {
  id: BuildingId;
  model: ModelId;
  address: string | null;
  height: number;
  polygons: string[];
  modelMetadata: ModelMetadata;
}

export interface BuildingWithoutModel {
  id: BuildingId;
  model: undefined;
  height: number;
  address: string | null;
  nodes: BuildingNode[];
}

export type Building = BuildingWithoutModel | BuildingWithModel;

export const isBuildingWithModel = (
  building: Building,
): building is BuildingWithModel => {
  return typeof building.id === "string" && typeof building.model === "string";
};

export interface ModelAlignment {
  modelId: ModelId;
  position: Position;
  scale: number;
  rotation?: Rotation;
}

export type ModelPosition = [number, number, number];

export interface UpdateBuilding {
  id: BuildingId;
  address: string | null;
  height: number | null;
}

export interface QueryObjects {
  position: { x: number; z: number };
  distance: number;
}
