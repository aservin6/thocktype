const BASE_URL = import.meta.env.VITE_API_URL;

// Module-level state is intentional here. All in-flight requests share the same
// refresh lock so only one token refresh happens regardless of how many 401s fire
// concurrently. The queue holds the resolve/reject callbacks of callers waiting
// on that refresh.
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

// skipRefresh should be set on auth endpoints (signin, signout, register) where
// a 401 means bad credentials, not an expired token. Attempting a refresh there
// would loop infinitely.
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
