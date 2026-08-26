import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const assets = [
  { id: 'default', title: 'PIXEL NOTES', subtitle: 'DESIGN / CODE / GAMES', accent: '#5ee18f', ogOnly: true },
  { id: 'pixel-design-notes', title: 'PIXEL DESIGN', subtitle: 'GRID / COLOR / FEEDBACK', accent: '#ff6b6b' },
  { id: 'astro-content-site', title: 'ASTRO CONTENT', subtitle: 'STATIC / FAST / SIMPLE', accent: '#5ee18f' },
  { id: 'old-game-interface', title: 'OLD GAME UI', subtitle: 'CLEAR STATE / FEEDBACK', accent: '#7aa2f7' },
  { id: 'slow-personal-site', title: 'SLOW WEB', subtitle: 'WRITE / REVISE / KEEP', accent: '#ffd166' },
  { id: 'weekly-design-fragments', title: 'DESIGN NOTES', subtitle: 'COLLECT / SORT / USE', accent: '#b69cff' },
  { id: 'four-color-palette', title: 'FOUR COLORS', subtitle: 'LIMITS CREATE ORDER', accent: '#ff8f70' },
]

function svg({ title, subtitle, accent }, width, height) {
  const unit = Math.round(width / 60)
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="#fffaf0"/>
    <g shape-rendering="crispEdges">
      <path d="M0 0H${width}V${unit * 5}H0Z M0 ${height - unit * 5}H${width}V${height}H0Z" fill="#171923"/>
      <rect x="${unit * 4}" y="${unit * 9}" width="${unit * 20}" height="${unit * 20}" fill="${accent}" stroke="#171923" stroke-width="${unit}"/>
      <rect x="${unit * 10}" y="${unit * 15}" width="${unit * 20}" height="${unit * 20}" fill="#ffd166" stroke="#171923" stroke-width="${unit}"/>
      <path d="M${width - unit * 22} ${unit * 7}h${unit * 16}v${unit * 4}h-${unit * 12}v${unit * 4}h${unit * 9}v${unit * 4}h-${unit * 6}" fill="none" stroke="#171923" stroke-width="${unit}"/>
      <path d="M${width - unit * 19} ${height - unit * 16}h${unit * 13}v${unit * 9}h-${unit * 18}v-${unit * 5}h${unit * 5}Z" fill="#7aa2f7" stroke="#171923" stroke-width="${unit}"/>
      <g fill="#171923">
        <rect x="${unit * 5}" y="${height - unit * 10}" width="${unit * 2}" height="${unit * 2}"/><rect x="${unit * 9}" y="${height - unit * 10}" width="${unit * 2}" height="${unit * 2}"/><rect x="${unit * 13}" y="${height - unit * 10}" width="${unit * 2}" height="${unit * 2}"/>
      </g>
    </g>
    <text x="${width / 2}" y="${height * 0.47}" text-anchor="middle" font-family="monospace" font-size="${Math.round(width / 14)}" font-weight="900" letter-spacing="0" fill="#171923">${title}</text>
    <text x="${width / 2}" y="${height * 0.62}" text-anchor="middle" font-family="monospace" font-size="${Math.round(width / 34)}" font-weight="700" letter-spacing="0" fill="#171923">${subtitle}</text>
  </svg>`
}

await fs.mkdir(path.join(root, 'public/images/og'), { recursive: true })
await fs.mkdir(path.join(root, 'public/images/posts'), { recursive: true })
await fs.mkdir(path.join(root, 'public/images/icons'), { recursive: true })

for (const asset of assets) {
  const ogBase = path.join(root, 'public/images/og', asset.id)
  await sharp(Buffer.from(svg(asset, 1200, 630))).png({ compressionLevel: 9, palette: true }).toFile(`${ogBase}.png`)
  await sharp(`${ogBase}.png`).webp({ lossless: true }).toFile(`${ogBase}.webp`)

  if (!asset.ogOnly) {
    const coverBase = path.join(root, 'public/images/posts', asset.id)
    await sharp(Buffer.from(svg(asset, 960, 540))).png({ compressionLevel: 9, palette: true }).toFile(`${coverBase}.png`)
    await sharp(`${coverBase}.png`).webp({ lossless: true }).toFile(`${coverBase}.webp`)
  }
}

const iconSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 16 16"><rect width="16" height="16" fill="#fffaf0"/><path fill="#171923" d="M1 1h14v14H1z"/><path fill="#5ee18f" d="M3 3h4v4H3zM9 9h4v4H9z"/><path fill="#ff6b6b" d="M9 3h4v4H9zM3 9h4v4H3z"/><path fill="#ffd166" d="M7 7h2v2H7z"/></svg>`
for (const size of [192, 512]) {
  const iconBase = path.join(root, `public/images/icons/icon-${size}`)
  await sharp(Buffer.from(iconSvg(size))).png({ compressionLevel: 9, palette: true }).toFile(`${iconBase}.png`)
  await sharp(`${iconBase}.png`).webp({ lossless: true }).toFile(`${iconBase}.webp`)
}

console.log(`Generated ${assets.length} OG images, ${assets.length - 1} article covers, and 2 app icons.`)
