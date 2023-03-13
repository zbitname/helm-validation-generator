import { IControlComment, TControlOperations } from '../interfaces';

export class RefControlComment implements IControlComment {
  compile(definitionName: string): TControlOperations {
    return {
      patchSchema: [{
        key: '$#ALL',
        value: definitionName,
        operation: 'unset',
      }, {
        key: '$ref',
        value: definitionName,
        operation: 'set',
      }],
    };
  }
}
