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

const backendConfig: NetworkConfigItem = {
  protocol: "http",
  host: "10.1.0.71",
  port: 8080,
};

// const backendConfig = {
//   protocol: "http",
//   host: "localhost",
//   port: 5173,
// }

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

export const { serveFromPublic } = networkConfig;
