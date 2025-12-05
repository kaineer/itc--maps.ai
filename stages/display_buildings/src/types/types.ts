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

export interface Building {
  id: string;
  address: string | null;
  nodes: BuildingNode[];
  height: number;
  position?: BuildingNode;
  modelUrl?: string;
}

export interface ModelAlignment {
  modelId: string;
  position: Position;
  scale: number;
  rotation?: Rotation;
}
