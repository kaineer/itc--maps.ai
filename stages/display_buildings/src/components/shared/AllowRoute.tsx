import { useAuthentication } from "@hooks/useAuthentication";
import { ReactNode } from "react";
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

  if (typeof role === "string" && !hasRole(role)) navigate(redirect);
  if (!enabled) navigate(redirect);

  return children;
};
