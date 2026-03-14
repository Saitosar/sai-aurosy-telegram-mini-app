import { Outlet } from "react-router-dom";
import { StorePositionsProvider } from "./useStorePositions";

export function MallGuideLayout() {
  return (
    <StorePositionsProvider>
      <Outlet />
    </StorePositionsProvider>
  );
}
