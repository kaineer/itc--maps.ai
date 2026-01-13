/**
 * Vector math utilities for ModelPosition type ([number, number, number])
 * Provides common operations for 3D position vectors used throughout the application
 */

import { type ModelPosition } from "src/types/types";

/**
 * Add two positions together (vector addition)
 * @param a First position
 * @param b Second position
 * @returns Result of a + b
 */
export const addPosition = (
  a: ModelPosition,
  b: ModelPosition,
): ModelPosition => {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
};

/**
 * Subtract position b from position a (vector subtraction)
 * @param a First position
 * @param b Second position to subtract
 * @returns Result of a - b
 */
export const subtractPosition = (
  a: ModelPosition,
  b: ModelPosition,
): ModelPosition => {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
};

/**
 * Multiply position by a scalar (vector scaling)
 * @param position Position to multiply
 * @param scalar Scalar value to multiply by
 * @returns Result of position * scalar
 */
export const multiplyPosition = (
  position: ModelPosition,
  scalar: number,
): ModelPosition => {
  return [position[0] * scalar, position[1] * scalar, position[2] * scalar];
};

/**
 * Calculate Euclidean distance between two positions
 * @param a First position
 * @param b Second position
 * @returns Distance between a and b
 */
export const distanceBetween = (a: ModelPosition, b: ModelPosition): number => {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

export const distance2dBetween = (
  a: ModelPosition,
  b: ModelPosition,
): number => {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Normalize a position vector (make it unit length)
 * @param position Position to normalize
 * @returns Normalized position (unit vector)
 */
export const normalizePosition = (position: ModelPosition): ModelPosition => {
  const length = Math.sqrt(
    position[0] * position[0] +
      position[1] * position[1] +
      position[2] * position[2],
  );

  if (length === 0) {
    return [0, 0, 0];
  }

  return [position[0] / length, position[1] / length, position[2] / length];
};

/**
 * Scale a position vector to a specific length
 * @param position Position to scale
 * @param targetLength Desired length
 * @returns Scaled position with specified length
 */
export const scaleToLength = (
  position: ModelPosition,
  targetLength: number,
): ModelPosition => {
  const normalized = normalizePosition(position);
  return multiplyPosition(normalized, targetLength);
};

/**
 * Calculate direction vector from position a to position b
 * @param from Starting position
 * @param to Target position
 * @returns Direction vector from 'from' to 'to'
 */
export const directionTo = (
  from: ModelPosition,
  to: ModelPosition,
): ModelPosition => {
  return [to[0] - from[0], to[1] - from[1], to[2] - from[2]];
};

/**
 * Calculate midpoint between two positions
 * @param a First position
 * @param b Second position
 * @returns Midpoint between a and b
 */
export const midpoint = (a: ModelPosition, b: ModelPosition): ModelPosition => {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
};

/**
 * Check if two positions are approximately equal (within epsilon)
 * @param a First position
 * @param b Second position
 * @param epsilon Maximum allowed difference (default: 0.0001)
 * @returns True if positions are approximately equal
 */
export const positionsEqual = (
  a: ModelPosition,
  b: ModelPosition,
  epsilon: number = 0.0001,
): boolean => {
  return (
    Math.abs(a[0] - b[0]) < epsilon &&
    Math.abs(a[1] - b[1]) < epsilon &&
    Math.abs(a[2] - b[2]) < epsilon
  );
};

/**
 * Create a copy of a position
 * @param position Position to copy
 * @returns New position with same values
 */
export const copyPosition = (position: ModelPosition): ModelPosition => {
  return [position[0], position[1], position[2]];
};

/**
 * Create a position with all components set to the same value
 * @param value Value for all components
 * @returns Position [value, value, value]
 */
export const createUniformPosition = (value: number): ModelPosition => {
  return [value, value, value];
};

/**
 * Calculate dot product of two positions
 * @param a First position
 * @param b Second position
 * @returns Dot product a · b
 */
export const dotProduct = (a: ModelPosition, b: ModelPosition): number => {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Calculate cross product of two positions (a × b)
 * @param a First position
 * @param b Second position
 * @returns Cross product a × b
 */
export const crossProduct = (
  a: ModelPosition,
  b: ModelPosition,
): ModelPosition => {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
};
