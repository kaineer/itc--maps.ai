import { useState, KeyboardEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buildingsSlice } from "../../store/buildingsSlice";
import { viewSlice } from "../../store/viewSlice";
import { Building } from "../../types/types";
import styles from "./BuildingSearch.module.css";

interface Props {
  enabled?: boolean;
  className?: string;
}

/**
 * BuildingSearch component for searching buildings by address and moving camera.
 *
 * Features:
 * - Search input for building address (format: "Street, House Number")
 * - Enter key or search button to trigger search
 * - Moves camera to 10 meters from found building
 * - Displays search results and errors
 * - Integrates with Redux for building data and camera control
 */
export const BuildingSearch = ({ enabled = true, className = "" }: Props) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [foundBuilding, setFoundBuilding] = useState<Building | null>(null);

  const { getFilteredBuildings } = buildingsSlice.selectors;
  const buildings = useSelector(getFilteredBuildings);

  if (!enabled) {
    return null;
  }

  /**
   * Normalize address for comparison
   * - Convert to lowercase
   * - Remove extra spaces
   * - Normalize punctuation
   */
  const normalizeAddress = (address: string): string => {
    return address
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .replace(/[,.]/g, ""); // Remove commas and periods
  };

  /**
   * Search for building by address
   * Supports formats:
   * - "Улица, Номер дома"
   * - "Street, House Number"
   * - Partial matches
   */
  const searchBuilding = () => {
    if (!searchQuery.trim()) {
      setSearchError("Please enter an address");
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setFoundBuilding(null);

    const normalizedQuery = normalizeAddress(searchQuery);

    // Find building by address
    const building = buildings.find((b) => {
      if (!b.address) return false;
      const normalizedBuildingAddress = normalizeAddress(b.address);
      return normalizedBuildingAddress.includes(normalizedQuery);
    });

    if (building) {
      setFoundBuilding(building);
      moveCameraToBuilding(building);
    } else {
      setSearchError(`Building not found: "${searchQuery}"`);
    }

    setIsSearching(false);
  };

  /**
   * Move camera to 10 meters from the building
   * Camera positioned 10 meters north of the building
   */
  const moveCameraToBuilding = (building: Building) => {
    if (!building.position) {
      setSearchError("Building has no position data");
      return;
    }

    const { x, z } = building.position;

    // Set camera target to building position (at ground level)
    const cameraTarget: [number, number, number] = [x, 0, z];

    // Position camera 10 meters north of the building
    // North is negative Z in Three.js coordinate system
    const cameraPosition: [number, number, number] = [x, 1.8, z - 10];

    dispatch(viewSlice.actions.updateCameraTarget(cameraTarget));
    dispatch(viewSlice.actions.updateCameraPosition(cameraPosition));

    // Optional: Also update building selection in Redux
    // This could be useful for highlighting the building
    dispatch(buildingsSlice.actions.setSelectedBuilding(
      `${building.address}|${x},${z}`
    ));
  };

  /**
   * Handle Enter key press in search input
   */
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      searchBuilding();
    }
  };

  /**
   * Clear search results and reset
   */
  const clearSearch = () => {
    setSearchQuery("");
    setSearchError(null);
    setFoundBuilding(null);
  };

  return (
    <div className={`${styles.buildingSearch} ${className}`}>
      <div className={styles.searchHeader}>
        <h3 className={styles.title}>Building Search</h3>
        <p className={styles.subtitle}>
          Enter address in format: "Street, House Number"
        </p>
      </div>

      <div className={styles.searchControls}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Main Street, 123"
            className={styles.searchInput}
            disabled={isSearching}
          />
          <button
            onClick={searchBuilding}
            disabled={isSearching || !searchQuery.trim()}
            className={styles.searchButton}
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>

        {searchQuery && (
          <button
            onClick={clearSearch}
            className={styles.clearButton}
          >
            Clear
          </button>
        )}
      </div>

      {searchError && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span>
          {searchError}
        </div>
      )}

      {foundBuilding && (
        <div className={styles.searchResults}>
          <div className={styles.resultHeader}>
            <span className={styles.successIcon}>✅</span>
            <span className={styles.resultTitle}>Building Found</span>
          </div>

          <div className={styles.buildingInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Address:</span>
              <span className={styles.infoValue}>{foundBuilding.address}</span>
            </div>

            {foundBuilding.position && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Position:</span>
                <span className={styles.infoValue}>
                  X: {foundBuilding.position.x.toFixed(2)},
                  Z: {foundBuilding.position.z.toFixed(2)}
                </span>
              </div>
            )}

            {foundBuilding.height && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Height:</span>
                <span className={styles.infoValue}>
                  {foundBuilding.height.toFixed(2)}m
                </span>
              </div>
            )}

            {foundBuilding.modelUrl && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>3D Model:</span>
                <span className={styles.infoValue}>Available</span>
              </div>
            )}
          </div>

          <div className={styles.cameraInfo}>
            <p className={styles.cameraNote}>
              Camera moved to 10 meters north of the building
            </p>
            <button
              onClick={() => moveCameraToBuilding(foundBuilding)}
              className={styles.moveAgainButton}
            >
              Move Camera Again
            </button>
          </div>
        </div>
      )}

      {buildings.length > 0 && !foundBuilding && !searchError && (
        <div className={styles.hint}>
          <span className={styles.hintIcon}>💡</span>
          <span className={styles.hintText}>
            {buildings.length} buildings loaded. Try searching by address.
          </span>
        </div>
      )}
    </div>
  );
};
