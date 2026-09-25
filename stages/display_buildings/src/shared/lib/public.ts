const publicBaseUrl = "http://localhost";

export async function fetchPublic(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  // Normalize endpoint - ensure it starts with a slash
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
  const url = `${publicBaseUrl}${normalizedEndpoint}`;

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

/**
 * Convenience function for making GET requests to the backend
 */
export async function getPublic<T = any>(
  endpoint: string,
  options: Omit<RequestInit, "method"> = {},
): Promise<T> {
  const response = await fetchPublic(endpoint, {
    method: "GET",
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
