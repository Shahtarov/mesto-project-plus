import { ERROR_AUTHORIZATED } from '../error';

export default class Unathorized extends Error {
  public statusCode: typeof ERROR_AUTHORIZATED;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_AUTHORIZATED;
  }
}
