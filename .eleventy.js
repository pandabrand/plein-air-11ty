const socialImages = require("@11tyrocks/eleventy-plugin-social-images");
const emojiRegex = require("emoji-regex");
const slugify = require("slugify");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const packageVersion = require("./package.json").version;
require("dotenv").config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(socialImages);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addWatchTarget("./src/sass/");

  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/fonts");
  eleventyConfig.addPassthroughCopy("./src/img");
  eleventyConfig.addPassthroughCopy("./src/favicon.png");

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addShortcode("packageVersion", () => `v${packageVersion}`);

  eleventyConfig.addLayoutAlias('base', 'base.njk');
  eleventyConfig.addLayoutAlias('json', 'json.njk');
  
  eleventyConfig.addFilter("slug", (str) => {
    if (!str) {
      return;
    }

    const regex = emojiRegex();
    // Remove Emoji first
    let string = str.replace(regex, "");

    return slugify(string, {
      lower: true,
      replacement: "-",
      remove: /[*+~·,()'"`´%!?¿:@\/]/g,
    });
  });

  eleventyConfig.addFilter('stripTags', (str) => {
    if(!str) {
      return;
    }

    const regex = /(<([^>]+)>)/gi;

    return str.replace(regex, '');
  });

  eleventyConfig.addFilter('stripNewlines', (str) => {
    if(!str) {
      return;
    }

    const regex = /\r?\n|\r/g;

    return str.replace(regex, '');
  });

  eleventyConfig.addFilter('stripEverything', (str) => {
    if(!str) {
      return;
    }
    const tags = /(<([^>]+)>)/gi;
    const newlines = /\r?\n|\r/g;

    return str.replace(tags, '').replace(newlines, '');
  });

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "tdbc-anchor",
    permalinkSymbol: "#",
    permalinkSpace: false,
    level: [1, 2, 3],
    slugify: (s) =>
      s
        .trim()
        .toLowerCase()
        .replace(/[\s+~\/]/g, "-")
        .replace(/[().`,%·'"!?¿:@*]/g, ""),
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  eleventyConfig.addFilter('navSort', function(values) {
    let copyValues = [...values];
    return copyValues.sort((a, b) => Math.sign(a.data.sortOrder - b.data.sortOrder));
  });

  eleventyConfig.setNunjucksEnvironmentOptions({
    throwOnUndefined: true,
  });

  eleventyConfig.addPassthroughCopy({
    "./src/js/carousel.js": "assets/js/carousel.js",
    "./src/js/nav.js": "assets/js/nav.js",
    "./src/js/fslightbox.js": "assets/js/fslightbox.js",
  });

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "public",
    },
  };
};
