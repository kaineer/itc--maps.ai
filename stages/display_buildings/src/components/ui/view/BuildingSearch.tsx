import classes from "./BuildingSearch.module.css";
import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buildingsSlice } from "@slices/buildingsSlice";
import { viewSlice } from "@slices/viewSlice";
import {
  Building,
  isBuildingWithModel,
  ModelPosition,
} from "../../../types/types";
import { CAMERA_HEIGHTS, DISTANCES } from "@utils/constants";
import clsx from "clsx";
import { CollapsibleForm } from "@components/shared/ui/CollapsibleForm";
import { createBackendService } from "@services/backendService";
import { FormHeader } from "./building-search/FormHeader";

interface Props {
  enabled?: boolean;
  className?: string;
  onToggled: (value: boolean) => void;
}

const backendService = createBackendService();

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
export const BuildingSearch = ({
  enabled = true,
  className = "",
  onToggled,
}: Props) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [foundBuilding, setFoundBuilding] = useState<Building | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { getFilteredBuildings } = buildingsSlice.selectors;
  const buildings = useSelector(getFilteredBuildings);

  // Auto-focus search input when form expands
  useEffect(() => {
    if (searchInputRef.current) {
      // Small delay to ensure DOM is ready and transition completes
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, []);

  /**
   * Get building position from either position field or first node
   * Returns { x, z } or null if no position data available
   */
  const getBuildingPosition = (
    building: Building,
  ): { x: number; z: number } | null => {
    if (isBuildingWithModel(building)) {
      // Use explicit position if available
      return { x: building.position.x, z: building.position.z };
    } else if (building.nodes && building.nodes.length > 0) {
      // Use first node from polygon vertices as position
      return { x: building.nodes[0].x, z: building.nodes[0].z };
    }
    return null;
  };

  const searchBuilding = () => {
    const fetchBuildings = async () => {
      try {
        const result = (await backendService.put("buildings/address", {
          address: searchQuery.trim(),
        })) as Building | null;

        if (result) {
          moveCameraToBuilding(result);
        }
      } catch (err) {
        setSearchError(String(err));
      }
    };

    if (!searchQuery.trim()) {
      setSearchError("Введите адрес для поиска");
    } else {
      fetchBuildings();
    }
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
    const cameraTarget: ModelPosition = [x, 0, z];

    // Position camera 10 meters north of the building
    // North is negative Z in Three.js coordinate system
    const cameraPosition: ModelPosition = [
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

  // Show expanded version
  return (
    <CollapsibleForm
      enabled={enabled}
      className={clsx(classes.container, className)}
      collapsedClassName={classes.collapsed}
      expandedClassName={classes.expanded}
      collapsed={{ buttonText: "🔍", title: "Нажмите для поиска зданий" }}
      closeTitle="Скрыть поиск"
      onToggled={onToggled}
    >
      <FormHeader />

      <div className={classes.searchControls}>
        <div className={classes.inputGroup}>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="например, Чкалова, 3"
            className={classes.searchInput}
            disabled={isSearching}
          />
          <button
            onClick={searchBuilding}
            disabled={isSearching || !searchQuery.trim()}
            className={classes.searchButton}
          >
            {isSearching ? "Идет поиск..." : "Найти"}
          </button>
        </div>

        {searchQuery && (
          <button onClick={clearSearch} className={classes.clearButton}>
            Очистить
          </button>
        )}
      </div>

      {searchError && (
        <div className={classes.errorMessage}>
          <span className={classes.errorIcon}>⚠️</span>
          {searchError}
        </div>
      )}

      {foundBuilding && (
        <div className={classes.searchResults}>
          <div className={classes.resultHeader}>
            <span className={classes.successIcon}>✅</span>
            <span className={classes.resultTitle}>Здание найдено</span>
          </div>

          <div className={classes.buildingInfo}>
            <div className={classes.infoRow}>
              <span className={classes.infoLabel}>Адрес:</span>
              <span className={classes.infoValue}>{foundBuilding.address}</span>
            </div>

            <div className={classes.infoRow}>
              <span className={classes.infoLabel}>Позиция:</span>
              <span className={classes.infoValue}>
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
              <div className={classes.infoRow}>
                <span className={classes.infoLabel}>Высота:</span>
                <span className={classes.infoValue}>
                  {foundBuilding.height.toFixed(2)}м
                </span>
              </div>
            )}

            {foundBuilding.modelUrl && (
              <div className={classes.infoRow}>
                <span className={classes.infoLabel}>3D Модель:</span>
                <span className={classes.infoValue}>Доступна</span>
              </div>
            )}
          </div>

          <div className={classes.cameraInfo}>
            <p className={classes.cameraNote}>
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
              className={classes.moveAgainButton}
            >
              Переместить камеру снова
            </button>
          </div>
        </div>
      )}

      {buildings.length > 0 && !foundBuilding && !searchError && (
        <div className={classes.hint}>
          <span className={classes.hintIcon}>💡</span>
          <span className={classes.hintText}>
            Загружено {buildings.length} зданий. Попробуйте поиск по адресу.
          </span>
        </div>
      )}
    </CollapsibleForm>
  );
};
