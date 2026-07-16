/// <reference types="vite/client" />

declare module 'markdown-it-texmath' {
  import type MarkdownIt from 'markdown-it'

  interface TexmathOptions {
    engine?: { renderToString: (tex: string, options?: object) => string }
    delimiters?: string | object
    katexOptions?: object
    outerSpace?: boolean
  }

  function texmath(md: MarkdownIt, options?: TexmathOptions): void
  export default texmath
}
