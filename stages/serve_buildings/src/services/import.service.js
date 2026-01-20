const { join } = require("path");
const fs = require("fs/promises");

const createImportService = (importDir) => {
  const readJSONFile = async (filename, defaultValue) => {
    try {
      const fullFilename = join(importDir, filename);
      console.log({ fullFilename });

      const data = await fs.readFile(fullFilename);
      return JSON.parse(data);
    } catch (err) {
      console.log("reading json error: ", String(err));
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
