import { execFileSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

function currentRevision() {
  if (process.env.COMMIT_SHA) return process.env.COMMIT_SHA.slice(0, 12)

  try {
    return execFileSync('git', ['rev-parse', '--short=12', 'HEAD'], { encoding: 'utf8' }).trim()
  } catch {
    return 'local'
  }
}

const serviceWorkerPath = path.join(process.cwd(), 'dist', 'service-worker.js')
const source = await readFile(serviceWorkerPath, 'utf8')
const versioned = source.replace('__BUILD_VERSION__', currentRevision())

if (source === versioned) throw new Error('Service worker build-version placeholder was not found.')

await writeFile(serviceWorkerPath, versioned)
console.log('Stamped service worker cache version.')
