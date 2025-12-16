const { join } = require("path");
const fs = require("fs/promises");

const createImportService = (importDir) => {
  const readJSONFile = async (filename, defaultValue) => {
    try {
      const fullFilename = join(importDir, filename);
      const data = await fs.readFile(fullFilename);
      return JSON.parse(data);
    } catch {
      return defaultValue;
    }
  };

  return {
    readJSONFile,
  };
};

module.exports = {
  createImportService,
};
