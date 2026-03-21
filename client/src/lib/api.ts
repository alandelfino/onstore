export async function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
  const token = localStorage.getItem("token");
  const storeId = localStorage.getItem("activeStoreId");
  
  const headers = new Headers(init?.headers);
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (storeId && !headers.has("x-store-id")) {
    headers.set("x-store-id", storeId);
  }

  return fetch(input, { ...init, headers });
}
