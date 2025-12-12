import { useEffect, useCallback, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Vector2, Vector3 } from "three";
import { useDispatch, useSelector } from "react-redux";
import { alignmentSlice } from "../../../store/slices/alignmentSlice";
import { getDirectionFromKey } from "../../shared/ui/keyToDirection";
import { CameraUpdateProps, EnabledProps } from "../../shared/types";
import { ModelData } from "../../../utils/modelTransform";
import { modelsCache } from "../../../utils/modelsCache";

interface Props extends EnabledProps, CameraUpdateProps {}

export const TopCameraController = ({ enabled, onCameraUpdate }: Props) => {
  const { camera, scene, raycaster } = useThree();
  const dispatch = useDispatch();

  // State for mouse dragging
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [isOverModel, setIsOverModel] = useState(false);
  const dragStartCameraPos = useRef<[number, number, number]>([0, 0, 0]);
  const dragStartModelPos = useRef<[number, number, number]>([0, 0, 0]);

  const { getTopCameraState, getModelTransform, getModelUUID } =
    alignmentSlice.selectors;
  const {
    moveTopCameraInDirection,
    moveModelInDirection,
    increasePositionStep,
    decreasePositionStep,
    rotateModelAroundY,
    increaseRotationStep,
    decreaseRotationStep,
    increaseModelScale,
    decreaseModelScale,
    toggleScaleStep,
    updateModelPosition,
    updateTopCameraPosition,
    setCameraView,
  } = alignmentSlice.actions;
  const cameraState = useSelector(getTopCameraState);
  const modelTransform = useSelector(getModelTransform);
  const modelUUID = useSelector(getModelUUID);
  const [currentModel, setCurrentModel] = useState<ModelData | null>(null);

  useEffect(() => {
    const fetchModelFromCache = async () => {
      if (modelUUID !== null) {
        const model = await modelsCache.getModel(modelUUID);
        if (model) {
          setCurrentModel(model);
        }
      }
    };

    if (modelUUID) {
      fetchModelFromCache();
    }
  }, [modelUUID]);

  // Key to direction mapping using event.code for layout independence
  // Imported from shared module for consistency across controllers

  // Keyboard event handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Handle Ctrl+Space to switch to perspective view
      if (event.ctrlKey && event.code === "Space") {
        event.preventDefault();

        dispatch(setCameraView("perspective"));
        return;
      }

      const direction = getDirectionFromKey(event);

      if (direction) {
        event.preventDefault();

        if (event.altKey && !event.ctrlKey) {
          if (direction === "north") {
            // Alt+W: Increase model scale

            dispatch(increaseModelScale());
          } else if (direction === "south") {
            // Alt+S: Decrease model scale

            dispatch(decreaseModelScale());
          }

          return;
        }

        if (event.ctrlKey) {
          if (direction === "east") {
            dispatch(rotateModelAroundY("clockwise"));
          } else if (direction === "west") {
            dispatch(rotateModelAroundY("counterclockwise"));
          }
          return;
        }

        // Check if Shift key is pressed
        if (event.shiftKey) {
          // Shift + WASD: Move model

          dispatch(moveModelInDirection(direction));
        } else {
          // WASD only: Move camera

          dispatch(moveTopCameraInDirection(direction));
        }

        return;
      }

      // Handle position step adjustment with Shift + Arrow keys
      if (event.shiftKey) {
        if (event.code === "ArrowUp") {
          event.preventDefault();

          dispatch(increasePositionStep());
        } else if (event.code === "ArrowDown") {
          event.preventDefault();

          dispatch(decreasePositionStep());
        }
      }

      // Handle rotation step adjustment with Ctrl + Arrow keys
      if (event.ctrlKey) {
        if (event.code === "ArrowUp") {
          event.preventDefault();

          dispatch(increaseRotationStep());
        } else if (event.code === "ArrowDown") {
          event.preventDefault();

          dispatch(decreaseRotationStep());
        }
      }

      // Handle scale step toggle with Ctrl+Shift+ArrowUp
      if (event.ctrlKey && event.shiftKey && event.code === "ArrowUp") {
        event.preventDefault();

        dispatch(toggleScaleStep());
      }
    },
    [
      enabled,
      dispatch,
      moveModelInDirection,
      moveTopCameraInDirection,
      increaseModelScale,
      decreaseModelScale,
      rotateModelAroundY,
      increasePositionStep,
      decreasePositionStep,
      increaseRotationStep,
      decreaseRotationStep,
      toggleScaleStep,
      setCameraView,
    ],
  );

  // Position step changes are now logged by AlignmentSliceLogger

  useEffect(() => {
    if (!enabled) return;

    // Camera updates are now logged by AlignmentSliceLogger

    // Configure camera properties for top view
    camera.position.set(...cameraState.position);

    // Use standard Y-up coordinate system (Three.js default)
    // For top-down view, camera looks down the negative Y axis
    camera.up.set(0, 1, 0);

    // For top-down view, always look downward (negative Y direction)
    // Calculate lookAt point based on camera height
    const cameraHeight = cameraState.position[1];
    const lookDownDistance = Math.max(cameraHeight * 0.2, 10); // Look 20% down or at least 10 units

    const lookAtPoint = new Vector3(
      cameraState.position[0], // Same X as camera
      cameraState.position[1] - lookDownDistance, // Look downward based on height
      cameraState.position[2], // Same Z as camera
    );

    // Look at point below camera to maintain consistent downward orientation
    camera.lookAt(lookAtPoint);

    // Update camera projection matrix
    camera.updateProjectionMatrix();

    // Camera positioning is now logged by AlignmentSliceLogger

    // Notify parent component about camera update
    if (onCameraUpdate) {
      onCameraUpdate(camera);
    }
  }, [enabled, camera, cameraState, onCameraUpdate]);

  // Model position changes are now logged by AlignmentSliceLogger

  // Check if mouse is over model
  const checkMouseOverModel = useCallback(
    (mouseX: number, mouseY: number) => {
      if (!currentModel) return false;

      // Set up raycaster
      raycaster.setFromCamera(new Vector2(mouseX, mouseY), camera);

      // Check intersection with model (simplified - in real implementation would check actual model geometry)
      // For now, we'll use a simple check based on model position
      const intersects = raycaster.intersectObjects(scene.children, true);

      // Check if any intersected object is the model
      return intersects.some((intersect) => {
        // This is a simplified check - in production would need proper model identification
        return (
          intersect.object.userData?.isModel === true ||
          intersect.object.name.includes("model") ||
          intersect.object.parent?.name.includes("model")
        );
      });
    },
    [camera, raycaster, scene, currentModel],
  );

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (!enabled) return;

      // Calculate normalized mouse coordinates
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      // Check if mouse is over model
      const overModel = checkMouseOverModel(mouseX, mouseY);
      setIsOverModel(overModel);

      // Change cursor on hover (before drag starts)
      document.body.style.cursor = overModel ? "grab" : "default";

      // Start dragging
      setIsDragging(true);
      setDragStartPos({ x: event.clientX, y: event.clientY });
      dragStartCameraPos.current = [...cameraState.position];
      dragStartModelPos.current = [...modelTransform.position];

      // Change cursor style during drag
      document.body.style.cursor = overModel ? "grabbing" : "move";

      event.preventDefault();
    },
    [
      enabled,
      cameraState.position,
      modelTransform.position,
      checkMouseOverModel,
    ],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!enabled || !isDragging) return;

      const deltaX = event.clientX - dragStartPos.x;
      const deltaY = event.clientY - dragStartPos.y;

      // Convert pixel delta to world units based on camera height
      // Higher camera = faster movement, lower camera = slower movement
      const sensitivity = (0.05 * cameraState.position[1]) / 100;

      if (isOverModel && currentModel) {
        // Drag model in XZ plane
        const newX = dragStartModelPos.current[0] + deltaX * sensitivity;
        const newZ = dragStartModelPos.current[2] + deltaY * sensitivity;

        dispatch(
          updateModelPosition({
            position: [newX, modelTransform.position[1], newZ],
          }),
        );
      } else {
        // Drag camera (move scene under camera)
        const newX = dragStartCameraPos.current[0] - deltaX * sensitivity;
        const newZ = dragStartCameraPos.current[2] - deltaY * sensitivity;

        dispatch(
          updateTopCameraPosition({
            position: [newX, cameraState.position[1], newZ],
          }),
        );
      }

      event.preventDefault();
    },
    [
      enabled,
      isDragging,
      isOverModel,
      dragStartPos,
      cameraState.position,
      modelTransform.position,
      currentModel,
      dispatch,
      updateModelPosition,
      updateTopCameraPosition,
    ],
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      if (!enabled) return;

      setIsDragging(false);
      setIsOverModel(false);

      // Restore default cursor
      document.body.style.cursor = "default";

      event.preventDefault();
    },
    [enabled],
  );

  // Add keyboard event listeners
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [enabled, handleKeyDown, handleMouseDown, handleMouseMove, handleMouseUp]);

  return null;
};
