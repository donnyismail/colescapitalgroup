import { readFileSync } from 'node:fs';
const site = JSON.parse(readFileSync(new URL('./_data/site.json', import.meta.url)));
export default { siteKey: 'coles', layout: 'coles/base.njk', site };
