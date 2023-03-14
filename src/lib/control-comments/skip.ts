import { IControlComment, TControlOperations } from '../interfaces';

export class SkipControlComment implements IControlComment {
  getOperations(...args: any[]): TControlOperations {
    return {
      skip: true,
    };
  }
}
