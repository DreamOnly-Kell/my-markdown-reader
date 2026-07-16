import './style.css'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github.min.css'
import { renderInto } from './render.ts'
import sampleSource from './sample.md?raw'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) {
  throw new Error('#app not found')
}

app.innerHTML = `
  <header class="topbar">
    <div class="brand">
      <span class="logo" aria-hidden="true">MD</span>
      <div>
        <h1>Markdown Reader</h1>
        <p class="tagline">本地 · 轻量 · GFM / Mermaid / KaTeX</p>
      </div>
    </div>
    <div class="actions">
      <label class="btn primary">
        打开文件
        <input id="file-input" type="file" accept=".md,.markdown,.mdown,.txt,text/markdown,text/plain" hidden />
      </label>
      <button type="button" class="btn" id="load-sample">加载样例</button>
    </div>
  </header>
  <div class="meta" id="meta">未打开文件 — 可拖入 .md 或加载样例</div>
  <main class="stage" id="drop-zone">
    <article class="markdown-body" id="preview" aria-live="polite"></article>
  </main>
`

const preview = document.querySelector<HTMLElement>('#preview')!
const meta = document.querySelector<HTMLElement>('#meta')!
const fileInput = document.querySelector<HTMLInputElement>('#file-input')!
const loadSampleBtn = document.querySelector<HTMLButtonElement>('#load-sample')!
const dropZone = document.querySelector<HTMLElement>('#drop-zone')!

async function showMarkdown(source: string, label: string): Promise<void> {
  meta.textContent = label
  meta.classList.remove('error')
  try {
    await renderInto(preview, source)
  } catch (err) {
    meta.textContent = `渲染失败: ${err instanceof Error ? err.message : String(err)}`
    meta.classList.add('error')
    preview.innerHTML = `<pre class="error-block">${escapeHtml(source)}</pre>`
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

async function readFile(file: File): Promise<void> {
  const text = await file.text()
  await showMarkdown(text, `${file.name} · ${(file.size / 1024).toFixed(1)} KB`)
}

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0]
  if (file) void readFile(file)
  fileInput.value = ''
})

loadSampleBtn.addEventListener('click', () => {
  void showMarkdown(sampleSource, 'sample.md（内置样例）')
})

;(['dragenter', 'dragover'] as const).forEach((ev) => {
  dropZone.addEventListener(ev, (e) => {
    e.preventDefault()
    dropZone.classList.add('dragover')
  })
})

;(['dragleave', 'drop'] as const).forEach((ev) => {
  dropZone.addEventListener(ev, (e) => {
    e.preventDefault()
    dropZone.classList.remove('dragover')
  })
})

dropZone.addEventListener('drop', (e) => {
  const file = e.dataTransfer?.files?.[0]
  if (file) void readFile(file)
})

void showMarkdown(sampleSource, 'sample.md（内置样例）')
