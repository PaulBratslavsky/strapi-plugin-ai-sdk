const COOKIE_REGEX = /(?:^|;\s*)jwtToken=([^;]*)/;

function getCookieValue(): string | undefined {
  const match = COOKIE_REGEX.exec(document.cookie);
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function getToken(): string | null {
  const raw = localStorage.getItem('jwtToken');
  if (raw) {
    try { return JSON.parse(raw); } catch { return raw; }
  }
  return getCookieValue() ?? null;
}

export function getBackendURL(): string {
  return (globalThis as any).strapi?.backendURL ?? '';
}
