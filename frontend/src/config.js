const rawUrl = import.meta.env.VITE_API_URL?.trim();

export const API_BASE_URL = rawUrl
  ? (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? rawUrl
      : `https://${rawUrl}`
    ).replace(/\/$/, "")
  : "http://127.0.0.1:8000";
