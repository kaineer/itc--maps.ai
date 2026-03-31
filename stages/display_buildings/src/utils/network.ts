//
/**
 * Составные части URL, для построения внутри
 *   функции makeUrlFromConfig
 */
type NetworkPort = string | number | undefined;

interface NetworkConfigItem {
  protocol?: string;
  host?: string;
  port: NetworkPort;
}

const tryToLoad = (key: string): unknown => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch (err) {
    return null;
  }
};

const loadedBackendConfig = tryToLoad("ekb3d/backend");

const backendConfig: NetworkConfigItem =
  (loadedBackendConfig as NetworkConfigItem | null) || {
    protocol: "http",
    host: "10.1.0.72",
    port: 8080,
  };

// Cached leaflet tiles config
const leafletConfig: NetworkConfigItem = {
  protocol: "http",
  host: backendConfig.host,
  port: 3000,
};

const networkConfig = {
  /**
   * Конфигурация для API-запросов
   */
  backend: backendConfig,
  /**
   * Конфигурация для моделек
   */
  minio: backendConfig,
  /**
   * Конфигурация для Leaflet
   */
  leaflet: leafletConfig,
  /**
   * true - бэкенд отсутствует, все работает через GET-запросы
   */
  // serveFromPublic: true,
  serveFromPublic: false,
};

const isEmpty = (value: NetworkPort) =>
  typeof value === "undefined" || value === "";

const isPortByDefault = (protocol: string, port: NetworkPort): boolean => {
  if (protocol === "http") {
    return isEmpty(port) || port === 80;
  } else if (protocol === "https") {
    return isEmpty(port) || port === 443;
  }

  return false;
};

const makeUrlFromConfig = ({
  protocol = "http",
  host = "localhost",
  port = "",
}: NetworkConfigItem) => {
  return (
    protocol +
    "://" +
    host +
    (isPortByDefault(protocol, port) ? "" : ":" + String(port))
  );
};

export const normalizeEndpoint = (endpoint: string) => {
  if (endpoint.startsWith("/")) {
    return endpoint;
  }
  return "/" + endpoint;
};

export const backendUrl = makeUrlFromConfig(networkConfig.backend);
export const minioUrl = makeUrlFromConfig(networkConfig.minio);
export const leafletUrl = makeUrlFromConfig(networkConfig.leaflet);
// export const leafletTemplate = `${leafletUrl}/osm_tiles/{z}/{x}/{y}.png`;
export const leafletTemplate = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export const { serveFromPublic } = networkConfig;
