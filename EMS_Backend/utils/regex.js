/**
 * Escapes special regular expression characters in a string.
 * Prevents ReDoS (Regular Expression Denial of Service) and Regex Injection vulnerabilities.
 * 
 * @param {string} string - Raw user search input
 * @returns {string} Escaped string safe for RegExp creation
 */
const escapeRegex = (string = '') => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = { escapeRegex };
