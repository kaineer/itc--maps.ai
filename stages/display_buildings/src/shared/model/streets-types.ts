import type { BuildingNode, QueryObjects } from "./buildings-types";

export type StreetId = string;

/** Узел полигона улицы — та же плоскость XZ, что и у зданий. */
export type StreetNode = BuildingNode;

/** Запрос улиц вокруг точки — тот же контракт, что и для зданий. */
export type StreetsQuery = QueryObjects;

export interface Street {
  id: StreetId;
  way_id: string | null;
  name: string | null;
  highway: string | null;
  width: number;
  nodes: StreetNode[];
}
