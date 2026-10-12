export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function notFound(_req, _res, next) {
  next(new ApiError(404, 'Resource not found'));
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: status >= 500 ? 'Something went wrong' : err.message,
      details: err.details || undefined
    }
  });
}
