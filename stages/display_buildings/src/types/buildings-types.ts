// NOTE: мне бы хотелось, чтобы эта штука никогда не пригодилась
//   но увы
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

interface ModelMetadata {
  position: ModelPosition;
  rotation: ModelPosition;
  scale: number;
}

interface BuildingWithModel {
  id: string;
  model: string;
  address: string | null;
  height: number;
  polygons: string[];
  modelMetadata: ModelMetadata;
}

interface BuildingWithoutModel {
  id: string;
  model: null;
  height: number;
  address: string | null;
  nodes: BuildingNode[];
}

export type Building = BuildingWithoutModel | BuildingWithModel;

export interface ModelAlignment {
  modelId: string;
  position: Position;
  scale: number;
  rotation?: Rotation;
}

export type ModelPosition = [number, number, number];

export interface UpdateBuilding {
  id: string;
  address: string | null;
  height: number | null;
}
