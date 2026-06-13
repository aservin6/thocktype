const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiClient(
  endpoint: string,
  config?: RequestInit,
): Promise<Response> {
  return fetch(`${BASE_URL + endpoint}`, {
    credentials: "include",
    ...config,
  });
}
