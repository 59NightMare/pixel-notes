import { spawn } from 'node:child_process'
import { watch } from 'node:fs'

const watchedDirectories = ['src/content', 'public/images/posts/uploads']
let buildRunning = false
let buildPending = false
let timer

function runBuild() {
  if (buildRunning) {
    buildPending = true
    return
  }

  buildRunning = true
  const fullBuild = process.env.CMS_FULL_BUILD === '1'
  console.log(fullBuild ? '[cms] Content changed. Running a full production build...' : '[cms] Content changed. Running a quick content check...')
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const child = spawn(command, ['run', fullBuild ? 'build' : 'cms:check'], {
    env: { ...process.env, SITE_URL: process.env.SITE_URL ?? 'http://127.0.0.1:4323' },
    shell: process.platform === 'win32',
    stdio: 'inherit',
  })

  child.on('exit', (code) => {
    buildRunning = false
    const label = fullBuild ? 'Build' : 'Content check'
    console.log(code === 0 ? `[cms] ${label} complete.` : `[cms] ${label} failed with exit code ${code}.`)
    if (buildPending) {
      buildPending = false
      runBuild()
    }
  })
}

function queueBuild() {
  clearTimeout(timer)
  timer = setTimeout(runBuild, 500)
}

watchedDirectories.forEach((directory) => watch(directory, { recursive: true }, queueBuild))
console.log(`[cms] Watching ${watchedDirectories.join(', ')}`)
