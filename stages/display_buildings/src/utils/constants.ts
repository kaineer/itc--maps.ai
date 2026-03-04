/**
 * Common constants for the Maps.ai 3D visualization system
 *
 * This file contains shared constants used across different parts of the application
 * to ensure consistency in measurements and configurations.
 */

import { ModelPosition } from "../types/types";

/**
 * Camera height constants for different viewing modes
 */
export const CAMERA_HEIGHTS = {
  /** Human eye level height (1.8 meters) */
  EYE_LEVEL: 1.8,

  /** Ground level height (0.05 meters - slightly above ground to avoid z-fighting) */
  GROUND_LEVEL: 0.05,

  /** Default camera height for top-down view */
  TOP_DOWN: 200.0,

  /** Minimum camera height to prevent going below ground */
  MIN_HEIGHT: 0.01,
} as const;

/**
 * Movement speed constants (units per second)
 */
export const MOVEMENT_SPEEDS = {
  /** Base movement speed for normal camera movement */
  BASE: 5.0,

  /** Fast movement speed when Shift key is pressed */
  FAST: 50.0,

  /** Slow/precise movement speed */
  SLOW: 1.0,

  /** For map */
  MAP: 100.0,
} as const;

/**
 * Camera field of view constants (in degrees)
 */
export const CAMERA_FOV = {
  /** Default field of view for perspective camera */
  DEFAULT: 60,

  /** Wide field of view */
  WIDE: 75,

  /** Narrow field of view (zoomed in) */
  NARROW: 45,

  /** Top-down camera field of view */
  TOP_DOWN: 45,
} as const;

/**
 * Distance constants (in meters)
 */
export const DISTANCES = {
  /** Default distance from building for camera positioning */
  FROM_BUILDING: 10.0,

  /** Minimum camera distance from target */
  MIN_CAMERA_DISTANCE: 1.0,

  /** Maximum camera distance from target */
  MAX_CAMERA_DISTANCE: 500.0,

  /** Default camera distance for perspective view */
  DEFAULT_CAMERA_DISTANCE: 20.0,

  /** Distance from camera to furthest building */
  BUILDING_DISTANCE: 300.0,

  /** Distance from last loaded camera position */
  LAST_LOADED_CAMERA_DISTANCE: 50.0,
} as const;

/**
 * Step sizes for alignment controls
 */
export const ALIGNMENT_STEPS = {
  /** Default position step size (in meters) */
  POSITION_DEFAULT: 0.1,

  /** Fine position step size */
  POSITION_FINE: 0.01,

  /** Coarse position step size */
  POSITION_COARSE: 1.0,

  /** Default rotation step size (in degrees) */
  ROTATION_DEFAULT: 1,

  /** Fine rotation step size */
  ROTATION_FINE: 0.1,

  /** Coarse rotation step size */
  ROTATION_COARSE: 5,

  /** Default scale step size (percentage) */
  SCALE_DEFAULT: 1,

  /** Fine scale step size */
  SCALE_FINE: 0.1,

  /** Coarse scale step size */
  SCALE_COARSE: 5,
} as const;

/**
 * Model transformation constants
 */
export const MODEL_CONSTANTS = {
  /** Default target size for model scaling (in meters) */
  TARGET_SIZE: 10.0,

  /** Minimum model scale factor */
  MIN_SCALE: 0.01,

  /** Maximum model scale factor */
  MAX_SCALE: 100.0,

  /** Default model scale */
  DEFAULT_SCALE: 1.0,
} as const;

/**
 * Coordinate system constants
 * Note: In Three.js, North is negative Z direction
 */
export const COORDINATES = {
  /** North direction vector (negative Z in Three.js) */
  NORTH: { x: 0, y: 0, z: -1 },

  /** East direction vector (positive X in Three.js) */
  EAST: { x: 1, y: 0, z: 0 },

  /** South direction vector (positive Z in Three.js) */
  SOUTH: { x: 0, y: 0, z: 1 },

  /** West direction vector (negative X in Three.js) */
  WEST: { x: -1, y: 0, z: 0 },

  START: { x: -6736606.72045857, z: 7713514.742933013 },
} as const;

/**
 * Default camera positions
 */
export const DEFAULT_CAMERA_POSITIONS = {
  /** Default view mode camera position */
  VIEW: [0, 50, 0] as ModelPosition,

  /** Default view mode camera target */
  VIEW_TARGET: [0, 0, 0] as ModelPosition,

  /** Default perspective camera position for alignment mode */
  PERSPECTIVE: [0, 20, 20] as ModelPosition,

  /** Default perspective camera target for alignment mode */
  PERSPECTIVE_TARGET: [0, 0, 0] as ModelPosition,

  /** Default top camera position for alignment mode */
  TOP: [0, 100, 0] as ModelPosition,

  /** Default top camera target for alignment mode */
  TOP_TARGET: [0, 0, 0] as ModelPosition,
} as const;

/**
 * UI constants
 */
export const UI_CONSTANTS = {
  /** Default search radius for building search (in meters) */
  SEARCH_RADIUS: 300,

  /** Maximum number of search results to show */
  MAX_SEARCH_RESULTS: 50,

  /** Debounce time for search input (in milliseconds) */
  SEARCH_DEBOUNCE: 300,
} as const;

// Re-export commonly used constants for backward compatibility
export const EYE_LEVEL_HEIGHT = CAMERA_HEIGHTS.EYE_LEVEL;
export const GROUND_LEVEL_HEIGHT = CAMERA_HEIGHTS.GROUND_LEVEL;
