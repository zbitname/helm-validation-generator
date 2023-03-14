import {
  IControlComment,
  ISchemaItemParams,
  ISchemaParams,
} from '../interfaces';

export abstract class ControlComment implements IControlComment {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public readonly schemaParams: ISchemaParams,
    public readonly schemaItemParams: ISchemaItemParams,
  ) {}

  abstract before(...args: any[]): void;
  abstract after(...args: any[]): void;
}
