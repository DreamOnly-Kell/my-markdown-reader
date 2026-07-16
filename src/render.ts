import MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token.mjs'
import type Renderer from 'markdown-it/lib/renderer.mjs'
import type { Options } from 'markdown-it'
import texmath from 'markdown-it-texmath'
import katex from 'katex'
import hljs from 'highlight.js'
import mermaid from 'mermaid'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function createMarkdownRenderer(): MarkdownIt {
  const md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    highlight(str: string, lang: string): string {
      if (lang === 'mermaid') {
        return `<pre class="mermaid">${escapeHtml(str.trim())}</pre>`
      }
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
        } catch {
          // fall through
        }
      }
      return `<pre class="hljs"><code>${escapeHtml(str)}</code></pre>`
    },
  })

  md.use(texmath, {
    engine: katex,
    delimiters: 'dollars',
    katexOptions: { throwOnError: false },
  })

  const defaultFence = md.renderer.rules.fence
  md.renderer.rules.fence = (
    tokens: Token[],
    idx: number,
    options: Options,
    env: unknown,
    self: Renderer,
  ): string => {
    const token = tokens[idx]
    const info = (token.info || '').trim()
    const lang = info.split(/\s+/g)[0] ?? ''
    if (lang === 'mermaid') {
      return `<pre class="mermaid">${escapeHtml(token.content.trim())}</pre>\n`
    }
    if (options.highlight) {
      const highlighted = options.highlight(token.content, lang, '')
      if (highlighted && highlighted.startsWith('<pre')) {
        return `${highlighted}\n`
      }
    }
    return defaultFence ? defaultFence(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options)
  }

  return md
}

const md = createMarkdownRenderer()

let mermaidReady = false

function ensureMermaid(): void {
  if (mermaidReady) return
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'neutral',
  })
  mermaidReady = true
}

/** Sync: Markdown → HTML (math + GFM structure; mermaid left as .mermaid nodes). */
export function renderMarkdown(source: string): string {
  return md.render(source)
}

/** Async: place HTML into container and run Mermaid on diagram nodes. */
export async function renderInto(container: HTMLElement, source: string): Promise<void> {
  ensureMermaid()
  container.innerHTML = renderMarkdown(source)
  const nodes = container.querySelectorAll<HTMLElement>('.mermaid')
  if (nodes.length === 0) return
  try {
    await mermaid.run({ nodes })
  } catch (err) {
    console.error('Mermaid render failed', err)
  }
}
