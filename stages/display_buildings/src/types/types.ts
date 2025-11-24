export interface BuildingNode {
  x: number;
  z: number;
}

export interface Building {
  address: string | null;
  nodes: BuildingNode[];
  height: number;
  position?: BuildingNode;
  modelUrl?: string;
}
