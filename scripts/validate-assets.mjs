import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const registry = JSON.parse(await fs.readFile(path.join(root, 'src/data/assets.json'), 'utf8'))
const errors = []

for (const asset of registry) {
  for (const field of ['path', 'type', 'source', 'creator', 'license', 'createdAt', 'alt', 'usage']) {
    if (!asset[field]) errors.push(`${asset.path ?? '(unknown)'}: missing ${field}`)
  }

  const file = path.join(root, 'public', asset.path.replace(/^\//, ''))
  try {
    const metadata = await sharp(file).metadata()
    if (metadata.width !== asset.width || metadata.height !== asset.height) {
      errors.push(`${asset.path}: expected ${asset.width}x${asset.height}, got ${metadata.width}x${metadata.height}`)
    }
    const webp = file.replace(/\.png$/, '.webp')
    await fs.access(webp)
  } catch (error) {
    errors.push(`${asset.path}: ${error.message}`)
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log(`Validated ${registry.length} registered image assets and optimized variants.`)
