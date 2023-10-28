/**
 * @class ApplicationError
 * @description base error class for application
 * @extends Error
 */
export class ApplicationError extends Error {
  public statusCode: number;
  public errors: string[] | undefined;

  /**
   * @description initializes the error class
   *
   * @param {number} statusCode status code of the request
   * @param {string} message error message
   * @param {string[]} errors an array containing errors
   */
  constructor(
    statusCode: number,
    message: string = "an error occurred",
    errors?: string[]
  ) {
    super(message);
    this.statusCode = statusCode || 500;
    this.message = message;
    this.errors = errors;
  }
}
