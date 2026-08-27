import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const dist = join(root, 'dist')

async function readRoute(route) {
  const file = join(dist, route === '/' ? 'index.html' : route.replace(/^\//, '').replace(/\/$/, '') + '/index.html')
  await access(file)
  return readFile(file, 'utf8')
}

const routes = ['/', '/archive/', '/categories/', '/tags/', '/about/', '/search/', '/en/', '/en/archive/', '/en/search/']
for (const route of routes) await readRoute(route)

const home = await readRoute('/')
const archive = await readRoute('/archive/')
const search = await readRoute('/search/')
const headerActions = await readFile(join(root, 'src/components/HeaderActions.vue'), 'utf8')
const styles = await readFile(join(root, 'styles.css'), 'utf8')

assert.match(home, /localStorage\.getItem\(['"]pixel-notes-theme['"]\)/, 'theme preference must be restored on page load')
assert.match(headerActions, /localStorage\.setItem\(['"]pixel-notes-theme['"]/, 'theme preference must be persisted')
assert.match(home, /href="\/"[^>]*aria-current="page"/, 'home navigation should expose its active state')
assert.match(archive, /href="\/archive\/"[^>]*aria-current="page"/, 'archive navigation should expose its active state')
assert.doesNotMatch(archive, /href="\/"[^>]*aria-current="page"/, 'home must not remain active on archive')
assert.match(search, /id="site-search"/, 'search page must expose the search input')
assert.match(search, /<link rel="canonical" href="[^"]*\/search\/"/, 'search page must expose its canonical route')
assert.match(home, /<meta name="viewport" content="width=device-width, initial-scale=1">/, 'pages must include a mobile viewport')
assert.match(styles, /img\{max-width:100%\}/, 'global styles must constrain images on narrow viewports')

console.log(`Smoke checks passed: ${routes.length} routes, theme persistence, navigation state, search, mobile constraints`)
