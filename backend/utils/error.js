
class AppError extends Error {
    constructor(message, statusCode, errorType) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4) ? 'error' : 'fail';
        this.isOperational = true;   
        Error.captureStackTrace(this, this.constructor)
    }
}
  
class AIError extends AppError {
    constructor(message, model) {
        super(message, 503, 'AI_SERVICE_ERROR');
        this.message = model;
    }
}

class DBError extends AppError {
    constructor(message) {
        super(message, 500, "DATABASE_ERROR");
    }
}

class ValidationError extends AppError {
    constructor(message, fields) {
        super(message, 400, 'VALIDATION_ERROR');
        this.fields = fields;
    }
}