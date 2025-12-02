import { WorldDirection } from "../../../store/alignmentSlice";

/**
 * Key to direction mapping using event.code for layout independence
 *
 * This mapping uses KeyboardEvent.code which represents the physical key location
 * rather than the character produced. This makes keyboard controls work with
 * any keyboard layout (Russian, English, etc.) without requiring users to
 * switch to English layout.
 *
 * Key codes:
 * - KeyW: Physical W key (produces 'ц' in Russian layout, 'w' in English)
 * - KeyA: Physical A key (produces 'ф' in Russian layout, 'a' in English)
 * - KeyS: Physical S key (produces 'ы' in Russian layout, 's' in English)
 * - KeyD: Physical D key (produces 'в' in Russian layout, 'd' in English)
 */
export const keyToDirection: { [key: string]: WorldDirection } = {
  KeyW: "north",
  KeyA: "west",
  KeyS: "south",
  KeyD: "east",
};

/**
 * Helper function to get direction from keyboard event
 * @param event KeyboardEvent to get direction from
 * @returns WorldDirection or undefined if key is not mapped
 */
export const getDirectionFromKey = (event: KeyboardEvent): WorldDirection | undefined => {
  return keyToDirection[event.code];
};

/**
 * Helper function to check if a key code is a direction key
 * @param code KeyboardEvent.code to check
 * @returns boolean indicating if the key is a direction key
 */
export const isDirectionKey = (code: string): boolean => {
  return code in keyToDirection;
};

/**
 * Helper function to get clean key name for display (removes 'Key' prefix)
 * @param code KeyboardEvent.code to format
 * @returns Clean key name for display (e.g., 'KeyW' -> 'W')
 */
export const getCleanKeyName = (code: string): string => {
  return code.replace("Key", "");
};
