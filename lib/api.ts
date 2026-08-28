const TUNNEL_API = "https://del-gained-arguments-steady.trycloudflare.com";

export function apiUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const env = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ?? "";
  if (env) return `${env}${normalized}`;
  if (
    typeof window !== "undefined" &&
    window.location.hostname.endsWith("github.io")
  ) {
    return `${TUNNEL_API}${normalized}`;
  }
  return normalized;
}
