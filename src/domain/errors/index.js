import CustomError from "./CustomError.js";
import ERROR_CODES from "./errorCodes.js";

class BadRequestError extends CustomError {
  constructor(message = "Bad request", details = {}) {
    super(message, ERROR_CODES.GENERAL.BAD_REQUEST, 400, details);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized access", details = {}) {
    super(message, ERROR_CODES.AUTH.UNAUTHORIZED, 401, details);
  }
}

class InvalidCredentialsError extends CustomError {
  constructor(message = "Invalid credentials", details = {}) {
    super(message, ERROR_CODES.AUTH.INVALID_CREDENTIALS, 401, details);
  }
}

class TokenExpiredError extends CustomError {
  constructor(message = "Expired token", details = {}) {
    super(message, ERROR_CODES.AUTH.TOKEN_EXPIRED, 401, details);
  }
}

class NotFoundError extends CustomError {
  constructor(message = "Resource not found", details = {}) {
    super(message, ERROR_CODES.RESOURCE.NOT_FOUND, 404, details);
  }
}

class AlreadyExistsError extends CustomError {
  constructor(message = "The resource already exists", details = {}) {
    super(message, ERROR_CODES.RESOURCE.ALREADY_EXISTS, 409, details);
  }
}

class InternalServerError extends CustomError {
  constructor(message = "Internal server error", details = {}) {
    super(message, ERROR_CODES.SERVER.INTERNAL_SERVER_ERROR, 500, details);
  }
}

class DatabaseError extends CustomError {
  constructor(message = "Database error", details = {}) {
    super(message, ERROR_CODES.SERVER.DATABASE_ERROR, 500, details);
  }
}

class RepositoryError extends CustomError {
  constructor(message = "Repository operation failed", details = {}) {
    super(message, ERROR_CODES.REPOSITORY.GENERIC, 500, details);
  }
}

class MissingDependencyError extends CustomError {
  constructor(message = "Required dependency not provided", details = {}) {
    super(message, ERROR_CODES.VALIDATION.MISSING_DEPENDENCY, 500, details);
  }
}

class InvalidInputError extends CustomError {
  constructor(message = "Invalid input", details = {}) {
    super(message, ERROR_CODES.VALIDATION.INVALID_INPUT, 400, details);
  }
}

class MissingFieldError extends CustomError {
  constructor(message = "Missing required field", details = {}) {
    super(message, ERROR_CODES.VALIDATION.MISSING_FIELD, 400, details);
  }
}

class ForbiddenError extends CustomError {
  constructor(message = "Forbidden access", details = {}) {
    super(message, ERROR_CODES.AUTH.FORBIDDEN, 403, details);
  }
}

export {
  CustomError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  InvalidCredentialsError,
  TokenExpiredError,
  NotFoundError,
  AlreadyExistsError,
  InternalServerError,
  DatabaseError,
  RepositoryError,
  MissingDependencyError,
  InvalidInputError,
  MissingFieldError,
  ERROR_CODES,
};
