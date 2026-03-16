import { EnabledProps } from "@.types/component-types";
import { NavigationButton } from "@components/kit/NavigationButton";
import { viewSlice } from "@slices/viewSlice";
import { GoMoveToTop } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";

type Props = EnabledProps;

export const ToggleMinimap = ({ enabled }: Props) => {
  const dispatch = useDispatch();
  const { enableMinimap, disableMinimap } = viewSlice.actions;
  const { getMinimapEnabled } = viewSlice.selectors;
  const minimapEnabled = useSelector(getMinimapEnabled);

  const handleClick = () => {
    if (minimapEnabled) {
      dispatch(disableMinimap());
    } else {
      dispatch(enableMinimap());
    }
  };

  if (!enabled) return null;

  return (
    <NavigationButton
      enabled={enabled}
      onClick={handleClick}
      title="Переключить миникарту"
    >
      <GoMoveToTop />
    </NavigationButton>
  );
};
