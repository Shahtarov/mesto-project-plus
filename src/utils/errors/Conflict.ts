import { ERROR_CONFLICT } from '../error';

export default class Conflict extends Error {
  public statusCode: typeof ERROR_CONFLICT;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CONFLICT;
  }
}
