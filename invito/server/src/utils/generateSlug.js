const { nanoid } = require('nanoid');

/**
 * Generate a unique slug for invitation URLs.
 * Uses nanoid with a custom length for readable, URL-safe slugs.
 * @param {number} length - Length of the slug (default: 10)
 * @returns {string} URL-safe unique slug
 */
const generateSlug = (length = 10) => {
  return nanoid(length);
};

module.exports = generateSlug;
