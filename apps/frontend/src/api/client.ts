const BASE_URL = import.meta.env.VITE_API_URL;

// Tracks whether a refresh is already in-flight
let isRefreshing = false;

// Queued callbacks waiting for the refresh to complete.
// Each entry resolves or rejects based on the refresh outcome.
let refreshQueue: Array<{
  resolve: () => void;
  reject: (err: unknown) => void;
}> = [];

// Drains the queue after a refresh attempt.
// Pass the error if refresh failed, nothing if it succeeded.
function drainQueue(err?: unknown) {
  refreshQueue.forEach((entry) => (err ? entry.reject(err) : entry.resolve()));
  refreshQueue = [];
}

// Waits in the queue until the in-flight refresh completes.
// Returns a promise that resolves on success or rejects on failure.
function waitForRefresh(): Promise<void> {
  return new Promise((resolve, reject) => {
    refreshQueue.push({ resolve, reject });
  });
}

async function attemptRefresh(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Refresh failed");
}

// TODO: Implement apiClient
// 1. Make the fetch request to BASE_URL + endpoint, always passing credentials: "include"
//    so httpOnly cookies are sent with every request
// 2. If the response is not a 401, return it as-is
// 3. If a refresh is already in-flight (isRefreshing), wait in the queue via waitForRefresh(),
//    then retry the original request once the refresh completes
// 4. Otherwise, set isRefreshing = true, call attemptRefresh(), drain the queue,
//    reset isRefreshing, and retry the original request
// 5. If attemptRefresh() throws, drain the queue with the error, reset isRefreshing,
//    and re-throw so callers can redirect to sign-in
export async function apiClient(
  endpoint: string,
  config?: RequestInit,
): Promise<Response> {
  const res = await fetch(`${BASE_URL + endpoint}`, {
    credentials: "include",
    ...config,
  });

  if (res.status != 401) return res;

  return res;
}
