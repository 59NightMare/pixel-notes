import fs from 'node:fs/promises'

const statuses = []
const optional = (label, configured, setup) => statuses.push(`${configured ? '[ready]' : '[setup]'} ${label}${configured ? '' : `: ${setup}`}`)

optional('Buttondown newsletter', Boolean(process.env.PUBLIC_BUTTONDOWN_USERNAME), 'set PUBLIC_BUTTONDOWN_USERNAME')
optional('Manual Cloudflare analytics', Boolean(process.env.PUBLIC_CF_WEB_ANALYTICS_TOKEN), 'prefer automatic Web Analytics in Cloudflare')
optional('giscus comments', ['PUBLIC_GISCUS_REPO', 'PUBLIC_GISCUS_REPO_ID', 'PUBLIC_GISCUS_CATEGORY', 'PUBLIC_GISCUS_CATEGORY_ID'].every((key) => process.env[key]), 'set all four PUBLIC_GISCUS_* values')

const cmsConfig = await fs.readFile('public/admin/config.yml', 'utf8')
optional('Sveltia CMS repository', !cmsConfig.includes('repo: owner/pixel-notes'), 'replace owner/pixel-notes in public/admin/config.yml')

console.log(statuses.join('\n'))
