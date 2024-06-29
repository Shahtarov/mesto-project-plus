import { ERROR_BAD_REQUEST } from '../error';

export default class BadRequest extends Error {
  public statusCode: typeof ERROR_BAD_REQUEST;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_BAD_REQUEST;
  }
}
