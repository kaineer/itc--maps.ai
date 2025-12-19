//
/**
 * Составные части URL, для построения внутри
 *   функции makeUrlFromConfig
 */
interface NetworkConfigItem {
  protocol?: string;
  host?: string;
  port?: string | number;
}

const backendConfig: NetworkConfigItem = {
  protocol: "http",
  host: "localhost",
  port: 5000,
}

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
}

const makeUrlFromConfig = ({
  protocol = "http",
  host = "localhost",
  port = "",
}: NetworkConfigItem) => {
  return (
    protocol + "://" + host + (port ? ":" + port : "")
  );
}

export const normalizeEndpoint = (endpoint: string) => {
  if (endpoint.startsWith("/")) {
    return endpoint;
  }
  return "/" + endpoint;
}

export const backendUrl = makeUrlFromConfig(networkConfig.backend);
export const minioUrl = makeUrlFromConfig(networkConfig.minio);

export const { serveFromPublic } = networkConfig;
