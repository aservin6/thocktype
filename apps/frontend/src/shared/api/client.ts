const BASE_URL = import.meta.env.VITE_API_URL;

// Prevents concurrent refresh attempts, subsequent 401s queue until the first resolves.
let isRefreshing = false;

let refreshQueue: Array<{
  resolve: () => void;
  reject: (err: unknown) => void;
}> = [];

function drainQueue(err?: unknown) {
  refreshQueue.forEach((entry) => (err ? entry.reject(err) : entry.resolve()));
  refreshQueue = [];
}

function waitForRefresh(): Promise<void> {
  return new Promise((resolve, reject) => {
    refreshQueue.push({ resolve, reject });
  });
}

async function attemptRefresh(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Refresh failed");
}

export async function apiClient(
  endpoint: string,
  config?: RequestInit,
  options?: { skipRefresh: boolean },
): Promise<Response> {
  const res = await fetch(`${BASE_URL + endpoint}`, {
    credentials: "include",
    ...config,
  });

  if (res.status !== 401) return res;
  if (options?.skipRefresh) return res;

  // Only "Token expired" warrants a refresh, no token or invalid token means
  // there's nothing to refresh, so reconstruct the response and return early.
  const error = await res.json();
  if (error.message !== "Token expired")
    return new Response(JSON.stringify({ message: error.message }), {
      headers: res.headers,
      status: res.status,
      statusText: res.statusText,
    });

  let retry: Response;
  try {
    if (isRefreshing) {
      await waitForRefresh();
    } else {
      isRefreshing = true;
      await attemptRefresh();
      drainQueue();
      isRefreshing = false;
    }

    retry = await fetch(`${BASE_URL + endpoint}`, {
      credentials: "include",
      ...config,
    });
  } catch (err) {
    drainQueue(err);
    isRefreshing = false;
    throw new Error("Token refresh failed");
  }

  if (retry.status === 401) throw new Error("Unauthorized after token refresh");
  return retry;
}
