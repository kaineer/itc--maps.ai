import { NavigationButton } from "@components/kit/NavigationButton";
import { viewSlice } from "@slices/viewSlice";
import { useDispatch } from "react-redux";
import { GoMoveToTop } from "react-icons/go";

interface Props {
  enabled: boolean;
}

export const ToggleMode = ({ enabled }: Props) => {
  const { toggleViewMode } = viewSlice.actions;
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(toggleViewMode());
  };

  if (!enabled) return null;

  return (
    <NavigationButton
      enabled={enabled}
      onClick={handleClick}
      title="Переключить режим"
    >
      <GoMoveToTop />
    </NavigationButton>
  );
};
