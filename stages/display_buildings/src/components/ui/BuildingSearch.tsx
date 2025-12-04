import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buildingsSlice } from "../../store/buildingsSlice";
import { viewSlice } from "../../store/viewSlice";
import { Building } from "../../types/types";
import { CAMERA_HEIGHTS, DISTANCES } from "../../utils/constants";
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
 * - Collapsible interface (always starts collapsed)
 */
export const BuildingSearch = ({ enabled = true, className = "" }: Props) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [foundBuilding, setFoundBuilding] = useState<Building | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { getFilteredBuildings } = buildingsSlice.selectors;
  const buildings = useSelector(getFilteredBuildings);

  if (!enabled) {
    return null;
  }

  const handleClose = () => {
    setIsExpanded(false);
    // Remove focus from input when closing the form
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  // Auto-focus search input when form expands
  useEffect(() => {
    if (isExpanded && searchInputRef.current) {
      // Small delay to ensure DOM is ready and transition completes
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  /**
   * Get building position from either position field or first node
   * Returns { x, z } or null if no position data available
   */
  const getBuildingPosition = (
    building: Building,
  ): { x: number; z: number } | null => {
    if (building.position) {
      // Use explicit position if available
      return { x: building.position.x, z: building.position.z };
    } else if (building.nodes && building.nodes.length > 0) {
      // Use first node from polygon vertices as position
      return { x: building.nodes[0].x, z: building.nodes[0].z };
    }
    return null;
  };

  /**
   * Normalize address for comparison
   * - Convert to lowercase
   * - Remove extra spaces
   * - Normalize common abbreviations and punctuation
   * - Remove special characters except spaces and common address separators
   */
  const normalizeAddress = (address: string): string => {
    let normalized = address
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .replace(/[,.]/g, ""); // Remove commas and periods

    // Normalize common address abbreviations to standard forms
    // Don't remove them, just standardize
    normalized = normalized
      .replace(/\bкорпус\b/g, "корп")
      .replace(/\bстроение\b/g, "стр")
      .replace(/\bдом\b/g, "д")
      .replace(/\bулица\b/g, "ул")
      .replace(/\bпроспект\b/g, "пр")
      .replace(/\bпр-т\b/g, "пр")
      .replace(/\bбульвар\b/g, "б-р")
      .replace(/\bпереулок\b/g, "пер");

    // Remove all non-alphanumeric characters except spaces, dash, and slash
    normalized = normalized.replace(/[^\w\sа-яё\-\/]/gi, "");

    // Remove extra spaces again after replacements
    normalized = normalized.replace(/\s+/g, " ").trim();

    return normalized;
  };

  /**
   * Search for building by address
   * Supports formats:
   * - "Улица, Номер дома" (с любыми символами в номере: 12А, 12-А, 12/1, 12 корп 1)
   * - "Street, House Number"
   * - Partial matches
   * - Поиск должен учитывать и улицу и номер дома
   */
  const searchBuilding = () => {
    if (!searchQuery.trim()) {
      setSearchError("Введите адрес для поиска");
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setFoundBuilding(null);

    const normalizedQuery = normalizeAddress(searchQuery);

    // Find building by address with flexible matching
    const building = buildings.find((b) => {
      if (!b.address) return false;

      const normalizedBuildingAddress = normalizeAddress(b.address);

      // 1. Exact match or contains match (most common case)
      if (normalizedBuildingAddress.includes(normalizedQuery)) {
        return true;
      }

      // 2. Try matching when query has both street and number
      // Extract house number if present
      const houseNumberMatch = normalizedQuery.match(/(\d+[а-яёa-z\d\/\-]*)/);
      if (houseNumberMatch) {
        const houseNumber = houseNumberMatch[0];
        const streetPart = normalizedQuery.replace(houseNumber, "").trim();

        // If we have both street and number, check if address contains both
        if (streetPart.length > 0) {
          // Check if building address contains both the street part AND house number
          // They don't need to be in the same order
          if (
            normalizedBuildingAddress.includes(streetPart) &&
            normalizedBuildingAddress.includes(houseNumber)
          ) {
            return true;
          }
        }
      }

      // 3. Try splitting query into parts for more flexible matching
      const queryParts = normalizedQuery
        .split(/\s+/)
        .filter((part) => part.length > 0);
      if (queryParts.length > 1) {
        // Check if all parts are present in the address (in any order)
        const allPartsMatch = queryParts.every((part) =>
          normalizedBuildingAddress.includes(part),
        );
        if (allPartsMatch) {
          return true;
        }
      }

      return false;
    });

    if (building) {
      setFoundBuilding(building);
      moveCameraToBuilding(building);
      // Remove focus from input after successful search
      // This prevents keyboard navigation keys (WASD) from being typed into the input
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    } else {
      // Try to provide more helpful error message
      // First, try to find by street name only
      const streetName = searchQuery
        .toLowerCase()
        .split(/\s*,\s*/)[0]
        .trim();
      const suggestions = buildings
        .filter(
          (b) => b.address && b.address.toLowerCase().includes(streetName),
        )
        .slice(0, 5)
        .map((b) => b.address);

      if (suggestions.length > 0) {
        setSearchError(
          `Здание не найдено: "${searchQuery}". Похожие адреса на ${streetName}: ${suggestions.join(", ")}`,
        );
      } else {
        setSearchError(`Здание не найдено: "${searchQuery}"`);
      }
    }

    setIsSearching(false);
  };

  /**
   * Move camera to 10 meters from the building
   * Camera positioned 10 meters north of the building
   */
  const moveCameraToBuilding = (building: Building) => {
    // Get building position using helper function
    const position = getBuildingPosition(building);

    if (!position) {
      setSearchError("У здания нет данных для определения положения");
      return;
    }

    const { x, z } = position;

    // Set camera target to building position (at ground level)
    const cameraTarget: [number, number, number] = [x, 0, z];

    // Position camera 10 meters north of the building
    // North is negative Z in Three.js coordinate system
    const cameraPosition: [number, number, number] = [
      x,
      CAMERA_HEIGHTS.EYE_LEVEL,
      z - DISTANCES.FROM_BUILDING,
    ];

    dispatch(viewSlice.actions.updateCameraTarget(cameraTarget));
    dispatch(viewSlice.actions.updateCameraPosition(cameraPosition));

    // Optional: Also update building selection in Redux
    // This could be useful for highlighting the building
    dispatch(
      buildingsSlice.actions.setSelectedBuilding(
        `${building.address}|${x},${z}`,
      ),
    );
  };

  /**
   * Handle Enter key press in search input
   */
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      searchBuilding();
      // Remove focus from input to prevent keyboard navigation interference
      event.currentTarget.blur();
    }
  };

  /**
   * Clear search results and reset
   */
  const clearSearch = () => {
    setSearchQuery("");
    setSearchError(null);
    setFoundBuilding(null);
    // Remove focus from input when clearing search
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  // If collapsed, show magnifying glass button
  if (!isExpanded) {
    return (
      <div
        className={`${styles.container} ${styles.collapsed} ${className}`}
        onClick={handleExpand}
        title="Нажмите для поиска зданий"
      >
        <button className={styles.collapsedButton}>🔍</button>
      </div>
    );
  }

  // Show expanded version
  return (
    <div className={`${styles.container} ${styles.expanded} ${className}`}>
      <div className={styles.panel}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className={styles.closeButton}
          title="Скрыть поиск"
        >
          ×
        </button>

        <div className={styles.searchHeader}>
          <h3 className={styles.title}>Поиск зданий</h3>
          <p className={styles.subtitle}>
            Введите адрес в формате: "Улица, Номер дома"
            <br />
            Поддерживаются: 12А, 12-А, 12/1, 12 корп 1 и т.д.
            <br />
            Примеры: "Чкалова, 3", "ул Чкалова 3", "Чкалова 3"
          </p>
        </div>

        <div className={styles.searchControls}>
          <div className={styles.inputGroup}>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="например, Чкалова, 3"
              className={styles.searchInput}
              disabled={isSearching}
            />
            <button
              onClick={searchBuilding}
              disabled={isSearching || !searchQuery.trim()}
              className={styles.searchButton}
            >
              {isSearching ? "Идет поиск..." : "Найти"}
            </button>
          </div>

          {searchQuery && (
            <button onClick={clearSearch} className={styles.clearButton}>
              Очистить
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
              <span className={styles.resultTitle}>Здание найдено</span>
            </div>

            <div className={styles.buildingInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Адрес:</span>
                <span className={styles.infoValue}>
                  {foundBuilding.address}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Позиция:</span>
                <span className={styles.infoValue}>
                  {(() => {
                    const position = getBuildingPosition(foundBuilding);
                    if (position) {
                      const source = foundBuilding.position
                        ? "явная"
                        : "из границ";
                      return `X: ${position.x.toFixed(2)}, Z: ${position.z.toFixed(2)} (${source})`;
                    } else {
                      return "Недоступно";
                    }
                  })()}
                </span>
              </div>

              {foundBuilding.height && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Высота:</span>
                  <span className={styles.infoValue}>
                    {foundBuilding.height.toFixed(2)}м
                  </span>
                </div>
              )}

              {foundBuilding.modelUrl && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>3D Модель:</span>
                  <span className={styles.infoValue}>Доступна</span>
                </div>
              )}
            </div>

            <div className={styles.cameraInfo}>
              <p className={styles.cameraNote}>
                Камера перемещена на 10 метров к северу от здания
              </p>
              <button
                onClick={() => {
                  moveCameraToBuilding(foundBuilding);
                  // Remove focus from input when moving camera again
                  if (searchInputRef.current) {
                    searchInputRef.current.blur();
                  }
                }}
                className={styles.moveAgainButton}
              >
                Переместить камеру снова
              </button>
            </div>
          </div>
        )}

        {buildings.length > 0 && !foundBuilding && !searchError && (
          <div className={styles.hint}>
            <span className={styles.hintIcon}>💡</span>
            <span className={styles.hintText}>
              Загружено {buildings.length} зданий. Попробуйте поиск по адресу.
            </span>
          </div>
        )}

        {/* Footer note */}
        <div className={styles.footer}>
          <div>Нажмите × чтобы скрыть</div>
        </div>
      </div>
    </div>
  );
};
