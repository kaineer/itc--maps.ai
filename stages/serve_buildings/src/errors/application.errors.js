class ApplicationError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends ApplicationError {
  constructor(message = "Validation error") {
    super(message, 400, "VALIDATION_ERROR");
  }
}

class NotFoundError extends ApplicationError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

class ConflictError extends ApplicationError {
  constructor(message = "Resource already exists") {
    super(message, 409, "CONFLICT");
  }
}

const handleError = (error, reply) => {
  if (error instanceof ApplicationError) {
    return reply.code(error.statusCode).send({
      code: error.code,
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }

  if (error.validation) {
    return reply.code(400).send({
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: error.validation,
        timestamp: new Date().toISOString(),
      },
    });
  }

  return reply.code(500).send({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occured",
      timestamp: new Date().toISOString(),
      requestId: reply.request.id,
    },
  });
};

module.exports = {
  ApplicationError,
  ValidationError,
  NotFoundError,
  ConflictError,
  handleError,
};
