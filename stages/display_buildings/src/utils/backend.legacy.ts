import { backendUrl, normalizeEndpoint, serveFromPublic } from "./network";
import { createTokenStorage } from "@hooks/useAuthentication";
import { createAuthToken } from "./authToken";

const urlForBackend = (endpoint: string): string => {
  return backendUrl + normalizeEndpoint(endpoint);
};

const tokenStorage = createTokenStorage();

/**
 * Utility function for making backend API calls
 * Automatically prepends the backend base URL to the endpoint
 *
 * @param endpoint - API endpoint (with or without leading slash)
 * @param options - Fetch options
 * @returns Promise with the response
 */
export async function fetchBackend(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const suffix = serveFromPublic ? ".json" : "";
  const url = urlForBackend(endpoint) + suffix;

  const token = tokenStorage.getToken();
  const { headers: authHeaders } = token ? createAuthToken(token) : {};

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      ...authHeaders,
    },
  });
}

/**
 * Convenience function for making GET requests to the backend
 */
export async function getBackend<T = any>(
  endpoint: string,
  options: Omit<RequestInit, "method"> = {},
): Promise<T> {
  const response = await fetchBackend(endpoint, {
    method: "GET",
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Convenience function for making PUT requests to the backend
 */
async function putSeriousBackend<T = any>(
  endpoint: string,
  body: any,
  options: Omit<RequestInit, "method" | "body"> = {},
): Promise<T> {
  const response = await fetchBackend(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const putBackend = serveFromPublic ? getBackend : putSeriousBackend;

/**
 * Convenience function for making POST requests to the backend
 */
export async function postBackend<T = any>(
  endpoint: string,
  body: any,
  options: Omit<RequestInit, "method" | "body"> = {},
): Promise<T> {
  const response = await fetchBackend(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Convenience function for making DELETE requests to the backend
 */
export async function deleteBackend<T = any>(
  endpoint: string,
  options: Omit<RequestInit, "method"> = {},
): Promise<T> {
  const response = await fetchBackend(endpoint, {
    method: "DELETE",
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function patchBackend<T = any>(
  endpoint: string,
  body: any,
  options: Omit<RequestInit, "method"> = {},
): Promise<T> {
  const response = await fetchBackend(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function uploadToBackend(endpoint: string, formData: FormData) {
  const url = urlForBackend(endpoint);
  return await fetch(url, {
    method: "POST",
    body: formData,
    // headers: {}
    //   // Заголовки при необходимости
    //   headers: {
    //     'Authorization': 'Bearer your-token-here', // если нужно
    //   },
  });
}

export const urlForModel = (uuid: string): string => {
  return urlForBackend("/model/" + uuid);
};

export async function downloadBinaryFromBackend(
  endpoint: string,
): Promise<Response> {
  const url = urlForBackend(endpoint);
  return await fetch(url, {
    method: "GET",
  });
}
