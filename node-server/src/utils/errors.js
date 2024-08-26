export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

export class AuthorizationError extends Error {
  constructor(message){
    super(message);
    this.name = 'AuthorizationError';
    this.status = 401;
  }
}

export default {
  AuthorizationError,
  NotFoundError,
  ValidationError
};
