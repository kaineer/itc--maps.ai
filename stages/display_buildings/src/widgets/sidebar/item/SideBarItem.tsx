import { type IconType } from "react-icons";
import classes from "./SideBarItem.module.css";
import { useNavigate } from "react-router";
import { uiSlice } from "@slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { type FC, useState } from "react";

interface DisplayableForm {
  enabled: boolean;
  onClose: () => void;
}

interface Props {
  icon: IconType;
  label: string;
  displayWhen?: () => boolean;
  onClick?: () => void;
  url?: string;
  form?: FC<DisplayableForm>;
}

export function SideBarItem({
  icon: Icon,
  label,
  displayWhen = () => true,
  onClick,
  url,
  form: Form,
}: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { getSidebarShowLabel, getSidebarShowItem } = uiSlice.selectors;
  const { setSidebarHidden } = uiSlice.actions;
  const showLabel = useSelector(getSidebarShowLabel);
  const showItem = useSelector(getSidebarShowItem);
  const [showForm, setShowForm] = useState(false);

  const handleClick = () => {
    if (typeof url === "string" && url) {
      navigate(url);
    }

    if (typeof onClick === "function") {
      onClick();
    }

    if (Form) {
      dispatch(setSidebarHidden(true));
      setShowForm(true);
    }
  };

  if (!displayWhen()) {
    return null;
  }

  const renderItem = () => (
    <li>
      <button
        className={classes.item}
        onClick={handleClick}
        aria-label={label}
        title={label}
      >
        <Icon size={20} />
        {showLabel && <span className={classes.label}>{label}</span>}
      </button>
    </li>
  );

  const renderForm = () =>
    Form && <Form enabled={showForm} onClose={() => setShowForm(false)} />;

  return (
    <>
      {showItem && renderItem()}
      {renderForm()}
    </>
  );
}
