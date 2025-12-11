const { handleError } = require("../errors/application.errors");

const createUploadController = (uploadService) => {
  const noFileUploaded = (reply) => {
    return reply.code(400).send({ error: "No file uploaded" });
  };

  const fileUploaded = (reply, result) => {
    return reply.code(200).send({
      message: "File uploaded",
      modelId: result.modelId,
    });
  };

  const internalServerError = (reply) => {
    return reply.code(500).send({ error: "Internal server error" });
  };

  const uploadFile0 = async (request, reply) => {
    const data = await request.file();

    if (!data || !data.file) {
      return noFileUploaded(reply);
    }

    const result = await uploadService.saveFile(data.file);

    return fileUploaded(reply, result);
  };

  const uploadFile = async (request, reply) => {
    try {
      await uploadFile0(request, reply);
    } catch (error) {
      console.error("Upload error:", error.message);
    }
  };

  return { uploadFile };
};

module.exports = { createUploadController };
