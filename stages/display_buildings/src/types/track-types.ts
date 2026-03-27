import { ModelPosition } from "./buildings-types";

export type TrackId = string;
export type TrackPointId = string;

export interface Track {
  id: TrackId;
  name: string;
}

export type CreateTrack = Omit<Track, "id">;

interface ParentTrack {
  trackId: TrackId;
}

export type CreateTrackPoint = Partial<Omit<TrackPoint, "id">> & ParentTrack;
export type UpdateTrackPoint = TrackPoint & ParentTrack;
export type DeleteTrackPoint = { id: TrackPointId } & ParentTrack;

interface TrackPointRestrictions {
  rotationRestricted: boolean;
  tiltRestricted: boolean;
  movementRestricted: boolean;
}

type PointType = "start" | "checkpoint" | "end";

export interface TrackPoint extends TrackPointRestrictions {
  id: TrackPointId;
  name: string;
  type: PointType;
  position: ModelPosition;
  rotation: ModelPosition;
  targetPosition: ModelPosition;
}

export interface TrackWithPoints extends Track {
  points: TrackPoint[];
}
