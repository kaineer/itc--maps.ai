import { useAuthentication } from "@hooks/useAuthentication";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";

interface Props {
  redirect: string;
  role?: string;
  enabled?: boolean;
  children: ReactNode;
}

export const AllowRoute = ({
  redirect,
  role,
  enabled = true,
  children,
}: Props) => {
  const { hasRole } = useAuthentication();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof role === "string" && !hasRole(role)) {
      navigate(redirect);
    }
    if (!enabled) {
      navigate(redirect);
    }
  }, [role, enabled, redirect, hasRole]);

  if (typeof role === "string" && !hasRole(role)) return null;
  if (!enabled) return null;

  return children;
};
