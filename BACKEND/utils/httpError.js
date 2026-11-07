// An Error that carries the HTTP status the error handler should send.
// expose = true means the message is safe to show the user even for a 5xx status.
export default class HttpError extends Error {
  constructor(statusCode, message, { expose = false } = {}) {
    super(message);
    this.statusCode = statusCode;
    this.expose = expose;
  }
}
