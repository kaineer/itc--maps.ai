import { AuthService, createAuthService } from "./authService";

interface BackendConfig {
  url: string;
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

const joinUrl = (base: string, part: string): string => {
  const left = base.endsWith("/") ? base : base + "/";
  const right = part.startsWith("/") ? part.slice(1) : part;
  return left + right;
};

const backendConfig: BackendConfig = {
  url: "http://10.1.0.248:5000",
};

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
const defaultMethod = "GET";

interface CallFetchOptions {
  method?: HTTPMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

interface FetchOptions {
  method?: HTTPMethod;
  body?: string;
  headers?: Record<string, string>;
}

export interface BackendService {
  get: (endpoint: string) => Promise<unknown>;
  post: (endpoint: string, body: unknown) => Promise<unknown>;
  del: (endpoint: string) => Promise<void>;
  put: (endpoint: string, body: unknown) => Promise<unknown>;
  patch: (endpoint: string, body: unknown) => Promise<unknown>;

  urlForEndpoint: (endpoint: string) => string;
  download: (endpoint: string) => Promise<Response>;
}

const methodsWithBody = ["POST", "PUT", "PATCH"];

const jsonHeaders = {};

export const createBackendService = (
  config: BackendConfig = backendConfig,
  authService: AuthService = createAuthService(),
): BackendService => {
  const { url } = config;

  const callFetch = async (endpoint: string, options: CallFetchOptions) => {
    const fullUrl = joinUrl(url, endpoint);

    const method = options.method || defaultMethod;
    const headers = {
      ...(options.headers || {}),
      ...authService.getHeaders(),
    };

    const fetchOptions: FetchOptions = {
      method,
      headers,
    };

    if (methodsWithBody.includes(method)) {
      fetchOptions.body = JSON.stringify(options.body || {});
    }

    const response = await fetch(fullUrl, fetchOptions);

    if (!response.ok) {
      if (response.status === 401) {
        authService.drop();
        throw new AuthenticationError("Not authenticated");
      }
    }

    return response.json();
  };

  return {
    get(endpoint: string): Promise<unknown> {
      return callFetch(endpoint, { method: "GET", headers: jsonHeaders });
    },
    post(endpoint: string, body: unknown): Promise<unknown> {
      return callFetch(endpoint, {
        method: "POST",
        body,
        headers: jsonHeaders,
      });
    },
    del(endpoint: string): Promise<void> {
      return callFetch(endpoint, { method: "DELETE", headers: jsonHeaders });
    },
    put(endpoint: string, body: unknown): Promise<unknown> {
      return callFetch(endpoint, { method: "PUT", body, headers: jsonHeaders });
    },
    patch(endpoint: string, body: unknown): Promise<unknown> {
      return callFetch(endpoint, {
        method: "PATCH",
        body,
        headers: jsonHeaders,
      });
    },
    download(endpoint: string): Promise<Response> {
      return fetch(joinUrl(config.url, endpoint));
    },
    urlForEndpoint(endpoint: string): string {
      const { url } = config;
      return joinUrl(url, endpoint);
    },
  };
};
