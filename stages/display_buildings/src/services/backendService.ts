import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import { AuthService, createAuthService } from "./authService";
import { createCookiesService } from "./cookiesService";

interface BackendConfig {
  url: string;
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message.split("\n")[0]);
  }
}
export class MessageError extends Error {
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
  signal?: AbortSignal;
}

export interface BackendService {
  get: (endpoint: string) => Promise<unknown>;
  post: (endpoint: string, body: unknown) => Promise<unknown>;
  del: (endpoint: string) => Promise<void>;
  put: (endpoint: string, body: unknown) => Promise<unknown>;
  patch: (endpoint: string, body: unknown) => Promise<unknown>;

  urlForEndpoint: (endpoint: string) => string;
  upload: (endpoint: string, formData: unknown) => Promise<unknown>;
  download: (endpoint: string) => Promise<Response>;
  baseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    {},
    FetchBaseQueryMeta
  >;
}

const methodsWithBody = ["POST", "PUT", "PATCH"];

const jsonHeaders = {
  "Content-Type": "application/json",
};

const { getCookie } = createCookiesService();

export const createBackendService = (
  config: BackendConfig = backendConfig,
  authService: AuthService = createAuthService(),
): BackendService => {
  const { url } = config;

  const prepareHeaders = (headers: Headers) => {
    const authHeaders = authService.getHeaders();
    if (
      "Authorization" in authHeaders &&
      typeof authHeaders.Authorization === "string"
    ) {
      headers.set("Authorization", authHeaders.Authorization);
    }
  };

  const callFetch = async (endpoint: string, options: CallFetchOptions) => {
    const fullUrl = joinUrl(url, endpoint);
    const controller = new AbortController();
    const { signal } = controller;

    const method = options.method || defaultMethod;
    const headers = {
      ...(options.headers || {}),
      ...authService.getHeaders(),
    };

    const fetchOptions: FetchOptions = {
      method,
      headers,
      signal,
    };

    if (methodsWithBody.includes(method)) {
      fetchOptions.body = JSON.stringify(options.body || {});
    }

    const timeoutId = setTimeout(() => controller.abort(), 2000);
    try {
      const response = await fetch(fullUrl, fetchOptions);

      if (!response.ok) {
        if (response.status === 401) {
          authService.drop();
          throw new AuthenticationError("Not authenticated");
        }
        if (response.status === 500) {
          throw new MessageError(getCookie("http.500"));
        }
      }

      // HACK
      if (response.headers.get("Content-Length") !== "0") {
        try {
          return response.json();
        } catch (err) {
          throw new ParseError(String(err));
        }
      }

      return;
    } catch (error) {
      clearTimeout(timeoutId);
      if (String(error).includes("AbortError")) {
        throw new MessageError("Превышено время ожидания ответа");
      }

      throw new MessageError(String(error));
    }
  };

  const urlForEndpoint = (endpoint: string): string => {
    const { url } = config;
    return joinUrl(url, endpoint);
  };

  return {
    get: (endpoint: string): Promise<unknown> => {
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
    upload(endpoint: string, formData: unknown): Promise<unknown> {
      if (typeof formData === "object" && formData instanceof FormData) {
        return fetch(joinUrl(config.url, endpoint), {
          method: "POST",
          body: formData,
          headers: {
            ...authService.getHeaders(),
          },
        });
      }

      return Promise.resolve(null);
    },
    download(endpoint: string): Promise<Response> {
      return fetch(joinUrl(config.url, endpoint));
    },
    urlForEndpoint,
    baseQuery: fetchBaseQuery({
      baseUrl: config.url,
      prepareHeaders,
    }),
  };
};
