/// <reference types="vite/client" />

declare module '*.module.scss' {
  const classes: Record<string, string>
  export default classes
}

interface Window {
  webkitAudioContext?: typeof AudioContext
}
