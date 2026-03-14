import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Upload,
  RotateCcw,
  MapPin,
  Route,
  GitBranch,
  Trash2,
  Save,
} from "lucide-react";
import { useStorePositions } from "./useStorePositions";
import { haptic } from "../../utils/haptic";
import { StoreMarkers } from "./StoreMarkers";
import { PathOverlay } from "./PathOverlay";
import type { StoredCalibration } from "./calibrationStorage";
import type { StorePosition } from "./cityMallStores";

type CalibrationMode = "store" | "reception" | "waypoints" | "wayGraph";

export function MallGuideCalibrationScreen() {
  const mapRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    reception,
    stores,
    pathMode,
    routes,
    pathSegments,
    saveStore,
    saveReception,
    deleteStore,
    setPathMode,
    saveRoute,
    deleteRoute,
    addPathSegment,
    removePathSegment,
    clearPathSegments,
    resetToDefaults,
    clearAllCalibration,
    exportJson,
    importJson,
  } = useStorePositions();

  const [mode, setMode] = useState<CalibrationMode>("store");
  const [storeName, setStoreName] = useState("");
  const [clickedPos, setClickedPos] = useState<StorePosition | null>(null);
  const [routeStore, setRouteStore] = useState<string>("");
  const [segmentFrom, setSegmentFrom] = useState<StorePosition | null>(null);

  const getClickPos = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = mapRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const left = ((e.clientX - rect.left) / rect.width) * 100;
    const top = ((e.clientY - rect.top) / rect.height) * 100;
    return { left, top };
  }, []);

  const handleMapClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const pos = getClickPos(e);
      if (!pos) return;

      if (mode === "reception") {
        saveReception(pos);
        setClickedPos(null);
      } else if (mode === "waypoints") {
        if (!routeStore || !stores[routeStore]) return;
        const waypoints = routes[routeStore] ?? [];
        saveRoute(routeStore, [...waypoints, pos]);
      } else if (mode === "wayGraph") {
        if (segmentFrom) {
          addPathSegment(segmentFrom, pos);
          setSegmentFrom(null);
        } else {
          setSegmentFrom(pos);
        }
      } else {
        setClickedPos(pos);
      }
    },
    [mode, routeStore, stores, routes, segmentFrom, saveReception, saveRoute, addPathSegment]
  );

  const handleSaveStore = useCallback(() => {
    const name = storeName.trim();
    if (!name || !clickedPos) return;
    saveStore(name, clickedPos);
    setStoreName("");
    setClickedPos(null);
  }, [storeName, clickedPos, saveStore]);

  const handleEditStore = useCallback((name: string) => {
    setStoreName(name);
    setClickedPos(stores[name] ?? null);
  }, [stores]);

  const handleExport = useCallback(() => {
    const json = exportJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "city-mall-stores.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [exportJson]);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string) as StoredCalibration;
          importJson(data);
        } catch {
          // ignore invalid JSON
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    [importJson]
  );

  const storeList = Object.entries(stores);

  return (
    <div className="min-h-full pb-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <motion.div whileTap={{ scale: 0.98 }}>
            <Link
              to="/scripts/mall-guide"
              className="flex items-center justify-center text-muted-foreground hover:text-white transition-colors min-h-[44px] min-w-[44px] touch-target"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </motion.div>
          <h1 className="text-lg font-semibold text-white">Calibration</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="relative z-10 p-4 space-y-4">
        <div className="flex justify-center">
          <div
            ref={mapRef}
            className="relative inline-block max-w-full max-h-[70vh] cursor-crosshair rounded-2xl overflow-hidden touch-none"
            onClick={handleMapClick}
          >
            <img
              src="/city-mall-floorplan.png"
              alt="City Mall floor plan"
              className="block max-w-full max-h-[70vh] w-auto h-auto object-contain"
            />
            <div className="absolute inset-0 bg-black/20" />
            <StoreMarkers targetStore={null} showAllStores />
            <PathOverlay
              path={
                mode === "waypoints" && routeStore && stores[routeStore]
                  ? [reception, ...(routes[routeStore] ?? []), stores[routeStore]]
                  : undefined
              }
              segments={mode === "wayGraph" ? pathSegments : undefined}
            />
            {clickedPos && mode === "store" && (
              <div
                className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-toxic border-2 border-white animate-pulse pointer-events-none"
                style={{ left: `${clickedPos.left}%`, top: `${clickedPos.top}%` }}
              />
            )}
            {segmentFrom && mode === "wayGraph" && (
              <div
                className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary border-2 border-white animate-pulse pointer-events-none"
                style={{ left: `${segmentFrom.left}%`, top: `${segmentFrom.top}%` }}
                title="Начало сегмента — кликните для конца"
              />
            )}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-4 sm:p-6 space-y-4">
          <motion.button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              haptic.impact("medium");
              clearAllCalibration();
              setClickedPos(null);
              setSegmentFrom(null);
              setStoreName("");
              setRouteStore("");
              haptic.success();
            }}
            className="w-full py-3 rounded-2xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <Trash2 className="w-4 h-4" />
            Сбросить все точки калибровки
          </motion.button>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Режим пути в симуляции:</span>
            <div className="flex gap-1">
              <motion.button
                type="button"
                onClick={() => setPathMode("waypoints")}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  pathMode === "waypoints"
                    ? "bg-primary text-black"
                    : "bg-white/10 text-white"
                }`}
                whileTap={{ scale: 0.98 }}
              >
                Waypoints
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setPathMode("wayGraph")}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  pathMode === "wayGraph"
                    ? "bg-primary text-black"
                    : "bg-white/10 text-white"
                }`}
                whileTap={{ scale: 0.98 }}
              >
                Way Graph
              </motion.button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              type="button"
              onClick={() => setMode("store")}
              className={`flex-1 min-w-[80px] min-h-[44px] py-3 rounded-2xl font-medium text-sm ${
                mode === "store"
                  ? "bg-primary text-black"
                  : "bg-white/10 text-white"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              Магазин
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setMode("reception")}
              className={`flex-1 min-w-[80px] min-h-[44px] py-3 rounded-2xl font-medium text-sm flex items-center justify-center gap-1 ${
                mode === "reception"
                  ? "bg-primary text-black"
                  : "bg-white/10 text-white"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <MapPin className="w-4 h-4" />
              Reception
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setMode("waypoints")}
              className={`flex-1 min-w-[80px] min-h-[44px] py-3 rounded-2xl font-medium text-sm flex items-center justify-center gap-1 ${
                mode === "waypoints"
                  ? "bg-primary text-black"
                  : "bg-white/10 text-white"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <Route className="w-4 h-4" />
              Waypoints
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setMode("wayGraph")}
              className={`flex-1 min-w-[80px] min-h-[44px] py-3 rounded-2xl font-medium text-sm flex items-center justify-center gap-1 ${
                mode === "wayGraph"
                  ? "bg-primary text-black"
                  : "bg-white/10 text-white"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <GitBranch className="w-4 h-4" />
              Way Graph
            </motion.button>
          </div>

          {mode === "waypoints" && (
            <div className="space-y-2">
              <p className="text-xs text-white/60">Режим пути: Waypoints</p>
              <select
                value={routeStore}
                onChange={(e) => setRouteStore(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-white"
              >
                <option value="">Выберите магазин</option>
                {Object.keys(stores).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-white/70">
                Кликните на карту, чтобы добавить точку маршрута (reception → магазин)
              </p>
              {(routes[routeStore] ?? []).length > 0 && (
                <>
                  <div className="max-h-24 overflow-y-auto space-y-1">
                    {(routes[routeStore] ?? []).map((wp, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-1 px-2 rounded bg-white/5 text-xs"
                      >
                        <span className="text-white/80">
                          {i + 1}. {wp.left.toFixed(0)}%, {wp.top.toFixed(0)}%
                        </span>
                        <motion.button
                          type="button"
                          onClick={() => {
                            const wps = (routes[routeStore] ?? []).filter(
                              (_, j) => j !== i
                            );
                            saveRoute(routeStore, wps);
                          }}
                          className="text-red-400 hover:text-red-300"
                          whileTap={{ scale: 0.98 }}
                        >
                          Удалить
                        </motion.button>
                      </div>
                    ))}
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => deleteRoute(routeStore)}
                    className="w-full py-2 rounded-2xl bg-red-500/20 text-red-400 text-sm font-medium"
                    whileTap={{ scale: 0.98 }}
                  >
                    Очистить маршрут
                  </motion.button>
                </>
              )}
            </div>
          )}

          {mode === "wayGraph" && (
            <div className="space-y-2">
              <p className="text-xs text-white/60">Режим пути: Way Graph</p>
              <p className="text-sm text-white/70">
                {segmentFrom
                  ? "Кликните на карту для конца сегмента"
                  : "Кликните на карту для начала сегмента"}
              </p>
              {pathSegments.length > 0 && (
                <>
                  <div className="max-h-24 overflow-y-auto space-y-1">
                    {pathSegments.map((seg, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-1 px-2 rounded bg-white/5 text-xs"
                      >
                        <span className="text-white/80 truncate">
                          {seg.from.left.toFixed(0)},{seg.from.top.toFixed(0)} →{" "}
                          {seg.to.left.toFixed(0)},{seg.to.top.toFixed(0)}
                        </span>
                        <motion.button
                          type="button"
                          onClick={() => removePathSegment(i)}
                          className="text-red-400 hover:text-red-300 shrink-0"
                          whileTap={{ scale: 0.98 }}
                        >
                          Удалить
                        </motion.button>
                      </div>
                    ))}
                  </div>
                  <motion.button
                    type="button"
                    onClick={clearPathSegments}
                    className="w-full py-2 rounded-2xl bg-red-500/20 text-red-400 text-sm font-medium"
                    whileTap={{ scale: 0.98 }}
                  >
                    Очистить все сегменты
                  </motion.button>
                </>
              )}
            </div>
          )}

          {mode === "store" && (
            <div className="space-y-2">
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Название магазина"
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40"
              />
              <motion.button
                type="button"
                onClick={handleSaveStore}
                disabled={!storeName.trim() || !clickedPos}
                className="w-full min-h-[44px] py-3 bg-primary text-black font-bold rounded-2xl disabled:opacity-50 flex items-center justify-center"
                whileTap={!storeName.trim() || !clickedPos ? undefined : { scale: 0.98 }}
                aria-label="Сохранить"
              >
                <Save className="w-5 h-5" />
              </motion.button>
              {clickedPos && (
                <p className="text-xs text-primary/80">
                  Координаты: left {clickedPos.left.toFixed(1)}%, top{" "}
                  {clickedPos.top.toFixed(1)}%
                </p>
              )}
            </div>
          )}

          {mode === "reception" && (
            <p className="text-sm text-white/70">
              Нажмите на карту, чтобы установить позицию Reception
            </p>
          )}
        </div>

        <div className="glass-card rounded-3xl p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-white mb-3">
            Магазины ({storeList.length})
          </h3>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {storeList.map(([name, pos]) => (
              <div
                key={name}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5"
              >
                <motion.button
                  type="button"
                  onClick={() => handleEditStore(name)}
                  className="text-left flex-1 min-w-0"
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-white font-medium truncate block">
                    {name}
                  </span>
                  <span className="text-xs text-white/50">
                    {pos.left.toFixed(0)}%, {pos.top.toFixed(0)}%
                  </span>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => deleteStore(name)}
                  className="text-red-400 hover:text-red-300 text-sm px-2"
                  whileTap={{ scale: 0.98 }}
                >
                  Удалить
                </motion.button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            type="button"
            onClick={handleExport}
            className="flex-1 py-3 rounded-2xl bg-white/10 text-white font-medium flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Экспорт
          </motion.button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileChange}
          />
          <motion.button
            type="button"
            onClick={handleImport}
            className="flex-1 py-3 rounded-2xl bg-white/10 text-white font-medium flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <Upload className="w-4 h-4" />
            Импорт
          </motion.button>
          <motion.button
            type="button"
            onClick={resetToDefaults}
            className="flex-1 py-3 rounded-2xl bg-white/10 text-white font-medium flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-4 h-4" />
            Сброс
          </motion.button>
        </div>
      </div>
    </div>
  );
}
