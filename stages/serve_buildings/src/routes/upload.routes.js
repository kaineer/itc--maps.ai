const { createUploadService } = require("../services/upload.service");
const { createUploadController } = require("../controllers/upload.controller");
const { uploadSchema } = require("../schemas/upload.schema");

const none = void 0;

const uploadRoutes = async (fastify /* , options */) => {
  const { uploadFile } = createUploadController(createUploadService());

  fastify.post("/upload", {
    schema: {
      ...uploadSchema,
      // because it is multipart and not JSON
      body: none,
    },
    handler: uploadFile,
  });
};

module.exports = { uploadRoutes };
