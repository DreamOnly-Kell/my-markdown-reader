import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { renderMarkdown } from '../src/render.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const sample = readFileSync(join(root, 'src/sample.md'), 'utf8')
const html = renderMarkdown(sample)

const checks: Record<string, boolean> = {
  h1: html.includes('<h1>'),
  table: html.includes('<table>'),
  code: html.includes('hljs') || html.includes('<code>'),
  katex: html.includes('katex'),
  mermaid: html.includes('class="mermaid"') && html.includes('flowchart'),
  linkify: html.includes('example.com'),
}

const failed = Object.entries(checks).filter(([, ok]) => !ok)
console.log(JSON.stringify(checks, null, 2))
if (failed.length > 0) {
  console.error('verify:render FAILED', failed.map(([k]) => k))
  process.exit(1)
}
console.log('verify:render PASS')
