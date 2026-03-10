import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { DashboardScreen } from "./screens/dashboard/DashboardScreen";
import { RobotsScreen } from "./screens/robots/RobotsScreen";
import { StoreScreen } from "./screens/store/StoreScreen";
import { ControlScreen } from "./screens/control/ControlScreen";
import { ScriptsScreen } from "./screens/scripts/ScriptsScreen";
import { MallGuideScreen } from "./screens/mall-guide/MallGuideScreen";

function RedirectToScriptsMallGuide() {
  return <Navigate to="/scripts/mall-guide" replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: DashboardScreen },
      { path: "robots", Component: RobotsScreen },
      { path: "store", Component: StoreScreen },
      { path: "control/:robotId", Component: ControlScreen },
      { path: "scripts", Component: ScriptsScreen },
      { path: "scripts/mall-guide", Component: MallGuideScreen },
      { path: "scenarios/mall-guide", Component: RedirectToScriptsMallGuide },
    ],
  },
]);
