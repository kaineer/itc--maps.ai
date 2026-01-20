const normalizeAddress = (address) => {
  let normalized = address
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/[,.]/g, ""); // Remove commas and periods

  // Normalize common address abbreviations to standard forms
  // Don't remove them, just standardize
  normalized = normalized
    .replace(/\bкорпус\b/g, "корп")
    .replace(/\bстроение\b/g, "стр")
    .replace(/\bдом\b/g, "д")
    .replace(/\bулица\b/g, "ул")
    .replace(/\bпроспект\b/g, "пр")
    .replace(/\bпр-т\b/g, "пр")
    .replace(/\bбульвар\b/g, "б-р")
    .replace(/\bпереулок\b/g, "пер");

  // Remove all non-alphanumeric characters except spaces, dash, and slash
  normalized = normalized.replace(/[^\w\sа-яё\-\/]/gi, "");

  // Remove extra spaces again after replacements
  normalized = normalized.replace(/\s+/g, " ").trim();

  return normalized;
};

module.exports = { normalizeAddress };
