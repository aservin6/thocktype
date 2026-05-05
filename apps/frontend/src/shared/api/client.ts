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
  // Original request
  const res = await fetch(`${BASE_URL + endpoint}`, {
    credentials: "include",
    ...config,
  });

  // If 401 but skipRefresh is true, return response
  if (res.status === 401 && options?.skipRefresh) return res;
  // If no 401 return response
  if (res.status != 401) return res;

  // If 401 hit refresh route
  let retry: Response;
  try {
    // If already refreshing
    // Promise is pushed to queue
    if (isRefreshing) {
      await waitForRefresh();

      // Retry fetch
      retry = await fetch(`${BASE_URL + endpoint}`, {
        credentials: "include",
        ...config,
      });
    } else {
      // Else, set isRefreshing to true
      // attemptRefresh()
      // then drainQueue()
      // set isRefreshing  to false
      isRefreshing = true;
      await attemptRefresh();
      drainQueue();
      isRefreshing = false;

      // Retry fetch
      retry = await fetch(`${BASE_URL + endpoint}`, {
        credentials: "include",
        ...config,
      });
    }
  } catch (err) {
    // Catch error
    // drainQueue with err,
    // all Promises in queue are rejected
    // isRefreshing is reset
    // new Error thrown
    drainQueue(err);
    isRefreshing = false;
    throw new Error("Token refresh failed");
  }
  if (retry.status === 401) throw new Error("Unauthorized after token refresh");
  return retry;
}
