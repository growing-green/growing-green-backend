const httpStatusCodes = require('./httpStatusCode');

class BaseError extends Error {
  constructor(statusCode, message) {
    super();

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.contructor.name;
    this.message = message || '알 수 없는 에러가 발생했습니다.';
    this.statusCode = statusCode || 500;
    Error.captureStackTrace(this, BaseError);
  }
}

class NotFoundError extends BaseError {
  constuctor(message) {
    super(httpStatusCodes.NOT_FOUND, message || '페이지를 찾을 수 없습니다.');
  }
}

class BadRequestError extends BaseError {
  constuctor(message) {
    super(httpStatusCodes.BAD_REQUEST, message || '잘못된 요청입니다.');
  }
}

class InvalidTokenError extends BaseError {
  constructor(message) {
    super(httpStatusCodes.BAD_REQUEST, message || '토큰이 유효하지 않습니다.');
  }
}
2;

class TokenExpiredError extends BaseError {
  contructor(message) {
    super(httpStatusCodes.UNAUTHORIZED, message || '토큰이 만료되었습니다.');
  }
}

module.exports = {
  BaseError,
  NotFoundError,
  BadRequestError,
  InvalidTokenError,
  TokenExpiredError,
};
