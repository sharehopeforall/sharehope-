const DEFAULT_TIMEOUT_MS = 3_000;

export function fetchBackend(
  input: string | URL,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
) {
  return fetch(input, {
    ...init,
    signal: init.signal ?? AbortSignal.timeout(timeoutMs),
  });
}
