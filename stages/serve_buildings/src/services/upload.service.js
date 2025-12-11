const { pipeline } = require("stream/promises");
const { createWriteStream } = require("fs");
const { join } = require("path");
const { v4: uuidv4 } = require("uuid");

const createUploadService = () => {
  const uploadDir = join(__dirname, "../../public");

  const saveFile0 = async (fileStream, fileId) => {
    const filename = fileId + ".fbx";
    const savePath = join(uploadDir, filename);

    await pipeline(fileStream, createWriteStream(savePath));
    return { modelId: fileId, filename, savePath };
  };

  const saveFile = async (fileStream) => {
    try {
      return saveFile0(fileStream, uuidv4());
    } catch (error) {
      throw new Error("Failed to save file: " + error.message);
    }
  };

  return { saveFile };
};

module.exports = { createUploadService };
