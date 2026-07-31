/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.MOV' {
  const src: string
  export default src
}

declare module '*.JPG' {
  const src: string
  export default src
}

interface ImportMetaEnv {
  readonly VITE_WEBHOOK_REGISTRO?: string
  readonly VITE_WEBHOOK_CALIFICACION?: string
  readonly VITE_PIXEL_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

