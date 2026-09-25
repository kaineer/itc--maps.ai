import { viewSlice } from "@features/explore-view";
import { GoMoveToTop } from "react-icons/go";
import { LuBuilding2 } from "react-icons/lu";

import { useDispatch, useSelector } from "react-redux";
import { useAuthentication } from "@entities/session";
import { Allow } from "@entities/session";
import { alignmentSlice } from "@features/align-model";
import { Building } from "@entities/buildings";
import { AttachPointSidebarItem } from "@features/attach-track-point";
import { TracksSidebarLists } from "./TrackSidebarLists";
import { BuildingModelEdit } from "@widgets/view/forms/edit-model/BuildingModelEdit";
import { useModelToEdit } from "@features/align-model";
import { AuthSidebarItems } from "@widgets/sidebar/common/AuthSidebarItems";
import { TracksSidebarItem } from "@widgets/sidebar/common/TracksSidebarItem";
import { UserListSidebarItem } from "@widgets/sidebar/common/UserlistSidebarItem";
import { HoveringSideBar, SideBarItem } from "@features/app-chrome";
import { BuildingSelection } from "../forms/selection/BuildingSelection";
import { EditPolygon } from "../forms/polygon/EditPolygon";

export const ViewSidebar = () => {
  const { isAuthenticated } = useAuthentication();

  const dispatch = useDispatch();
  const { getMinimapEnabled } = viewSlice.selectors;
  const minimapEnabled = useSelector(getMinimapEnabled);
  const { enableMinimap, disableMinimap } = viewSlice.actions;

  const { getSelectedPolygons } = alignmentSlice.selectors;
  const selectedPolygons: Building[] = useSelector(getSelectedPolygons);
  const polygon = selectedPolygons.length === 1 ? selectedPolygons[0] : "";

  const { modelToEdit } = useModelToEdit();

  const handleToggleMinimap = () => {
    if (minimapEnabled) {
      dispatch(disableMinimap());
    } else {
      dispatch(enableMinimap());
    }
  };

  return (
    <HoveringSideBar>
      <AuthSidebarItems />
      <SideBarItem
        icon={GoMoveToTop}
        label={minimapEnabled ? "Выключить миникарту" : "Включить миникарту"}
        onClick={handleToggleMinimap}
      />
      <Allow role="Admin">
        <TracksSidebarItem />
        <UserListSidebarItem />
      </Allow>
      <Allow condition={isAuthenticated}>
        <AttachPointSidebarItem />
        <SideBarItem
          icon={LuBuilding2}
          label="Выбранные полигоны"
          form={BuildingSelection}
        />
        <SideBarItem
          icon={LuBuilding2}
          label="Изменить полигон"
          form={EditPolygon}
          displayWhen={() => !!polygon}
        />
        <SideBarItem
          icon={LuBuilding2}
          label="Изменить модель"
          form={BuildingModelEdit}
          displayWhen={() => Boolean(modelToEdit)}
        />
        <TracksSidebarLists />
      </Allow>
    </HoveringSideBar>
  );
};
