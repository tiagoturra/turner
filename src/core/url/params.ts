export function readUrlParam(name: string, search = typeof window === 'undefined' ? '' : window.location.search) {
  return new URLSearchParams(search).get(name)
}

export function readUrlParams(search = typeof window === 'undefined' ? '' : window.location.search) {
  return Object.fromEntries(new URLSearchParams(search).entries())
}
