import { useAuthentication } from "@hooks/useAuthentication";
import { UnauthorizedRouter } from "./UnauthorizedRouter";
import { AuthorizedRouter } from "./AuthorizedRouter";

export const AppContent = () => {
  const { isAuthenticated } = useAuthentication();

  return isAuthenticated ? <AuthorizedRouter /> : <UnauthorizedRouter />;
};
