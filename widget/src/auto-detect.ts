// Capture currentScript at module parse time (only available synchronously during load)
const _currentScript = document.currentScript as HTMLScriptElement | null

export function detectStrapiUrl(): string {
  if (_currentScript?.src) {
    return new URL(_currentScript.src).origin
  }
  // Fallback: scan for our script tag
  const el = document.querySelector<HTMLScriptElement>('script[src*="ai-sdk/widget"]')
  if (el?.src) {
    return new URL(el.src).origin
  }
  return globalThis.location.origin
}

export function getScriptData(key: string): string | undefined {
  return _currentScript?.dataset[key] ?? undefined
}
