import { IControlComment, TControlOperations } from '../interfaces';

export class SkipControlComment implements IControlComment {
  compile(...args: any[]): TControlOperations {
    return {
      break: true,
    };
  }
}
