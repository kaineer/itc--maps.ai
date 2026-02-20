import { useAuthentication } from "@hooks/useAuthentication";
import { ReactNode } from "react";

interface Props {
  role?: string;
  condition?: boolean;
  children: ReactNode;
}

export const Allow = ({ children, role, condition = true }: Props) => {
  const { hasRole } = useAuthentication();

  if (!condition) return null;
  if (role && !hasRole(role)) return null;

  return [children];
};
