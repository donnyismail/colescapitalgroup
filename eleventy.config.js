import { IdAttributePlugin } from '@11ty/eleventy';
import Image from '@11ty/eleventy-img';
import path from 'node:path';

// Responsive image shortcode: local files -> AVIF/WebP/fallback, lazy, no CLS.
async function imageShortcode(src, alt, sizes = '100vw', cls = '') {
  if (!src) return '';
  if (alt === undefined) throw new Error(`Missing alt text for image: ${src}`);
  // remote (placeholder) images: render a plain lazy <img>, swapped for real assets later
  if (/^https?:\/\//.test(src)) {
    return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async"${cls ? ` class="${cls}"` : ''} />`;
  }
  const inputDir = path.join('src', src.replace(/^\//, ''));
  const metadata = await Image(inputDir, {
    widths: [400, 800, 1200, 1600],
    formats: ['avif', 'webp', 'jpeg'],
    outputDir: './dist/img/',
    urlPath: '/img/',
  });
  return Image.generateHTML(metadata, {
    alt,
    sizes,
    loading: 'lazy',
    decoding: 'async',
    ...(cls ? { class: cls } : {}),
  });
}

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(IdAttributePlugin);

  // Static assets per site (css, js, logos, favicons, admin)
  eleventyConfig.addPassthroughCopy('src/pines/assets');
  eleventyConfig.addPassthroughCopy('src/coles/assets');
  eleventyConfig.addPassthroughCopy('src/pines/admin');
  eleventyConfig.addPassthroughCopy('src/coles/admin');
  eleventyConfig.addPassthroughCopy('src/pines/site.webmanifest');
  eleventyConfig.addPassthroughCopy('src/coles/site.webmanifest');
  eleventyConfig.addPassthroughCopy('src/pines/robots.txt');
  eleventyConfig.addPassthroughCopy('src/coles/robots.txt');

  eleventyConfig.addWatchTarget('src/**/*.css');

  eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcode);

  // Collections (tags assigned via directory data files)
  eleventyConfig.addCollection('properties', (c) =>
    c.getFilteredByTag('property').sort((a, b) => (a.data.order || 0) - (b.data.order || 0)),
  );
  eleventyConfig.addCollection('projects', (c) =>
    c.getFilteredByTag('project').sort((a, b) => (b.data.year || 0) - (a.data.year || 0)),
  );
  eleventyConfig.addCollection('pipeline', (c) =>
    c.getFilteredByTag('pipeline').sort((a, b) => (a.data.order || 0) - (b.data.order || 0)),
  );
  eleventyConfig.addCollection('press', (c) =>
    c.getFilteredByTag('press').sort((a, b) => (a.data.order || 0) - (b.data.order || 0)),
  );
  eleventyConfig.addCollection('portfolio', (c) =>
    c.getFilteredByTag('portfolio').sort((a, b) => (a.data.order || 0) - (b.data.order || 0)),
  );
  eleventyConfig.addCollection('stats', (c) =>
    c.getFilteredByTag('stat').sort((a, b) => (a.data.order || 0) - (b.data.order || 0)),
  );

  // money filter
  eleventyConfig.addFilter('money', (n) => '$' + Number(n).toLocaleString('en-US'));
  eleventyConfig.addFilter('yy', (y) => "'" + String(y).slice(-2));

  return {
    dir: { input: 'src', output: 'dist', includes: '_includes', data: '_data' },
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    templateFormats: ['njk', 'md', 'html'],
  };
}
