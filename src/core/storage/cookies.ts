type CookieOptions = {
  expires?: Date
  maxAge?: number
  path?: string
  sameSite?: 'Lax' | 'Strict' | 'None'
  secure?: boolean
}

export function readCookie(name: string) {
  if (typeof document === 'undefined') return null
  const prefix = `${encodeURIComponent(name)}=`
  const cookie = document.cookie.split('; ').find((item) => item.startsWith(prefix))
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null
}

export function writeCookie(name: string, value: string, options: CookieOptions = {}) {
  if (typeof document === 'undefined') return
  const attributes = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `Path=${options.path ?? '/'}`,
    options.maxAge !== undefined ? `Max-Age=${options.maxAge}` : '',
    options.expires ? `Expires=${options.expires.toUTCString()}` : '',
    `SameSite=${options.sameSite ?? 'Lax'}`,
    (options.secure ?? (location.protocol === 'https:')) ? 'Secure' : '',
  ].filter(Boolean)
  document.cookie = attributes.join('; ')
}

export function removeCookie(name: string, path = '/') {
  writeCookie(name, '', { path, maxAge: 0 })
}
