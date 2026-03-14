import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { DashboardScreen } from "./screens/dashboard/DashboardScreen";
import { RobotsScreen } from "./screens/robots/RobotsScreen";
import { StoreScreen } from "./screens/store/StoreScreen";
import { ControlScreen } from "./screens/control/ControlScreen";
import { ScriptsScreen } from "./screens/scripts/ScriptsScreen";
import { MallGuideLayout } from "./screens/mall-guide/MallGuideLayout";
import { MallGuideScreen } from "./screens/mall-guide/MallGuideScreen";
import { MallGuideCalibrationScreen } from "./screens/mall-guide/MallGuideCalibrationScreen";
import { EventModeDemoScreen } from "./screens/demo/EventModeDemoScreen";
import { WalletScreen } from "./screens/wallet/WalletScreen";
import { SettingsScreen } from "./screens/settings/SettingsScreen";
import { UserProfileScreen } from "./screens/settings/UserProfileScreen";

function RedirectToScriptsMallGuide() {
  return <Navigate to="/scripts/mall-guide" replace />;
}

export const router = createBrowserRouter([
  { path: "/demo", Component: EventModeDemoScreen },
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: DashboardScreen },
      { path: "robots", Component: RobotsScreen },
      { path: "store", Component: StoreScreen },
      { path: "wallet", Component: WalletScreen },
      { path: "settings", Component: SettingsScreen },
      { path: "settings/profile", Component: UserProfileScreen },
      { path: "control/:robotId", Component: ControlScreen },
      { path: "scripts", Component: ScriptsScreen },
      {
        path: "scripts/mall-guide",
        Component: MallGuideLayout,
        children: [
          { index: true, Component: MallGuideScreen },
          { path: "calibration", Component: MallGuideCalibrationScreen },
        ],
      },
      { path: "scenarios/mall-guide", Component: RedirectToScriptsMallGuide },
    ],
  },
]);
