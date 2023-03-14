import { ControlComment } from '../classes/ControlComment';
import { IJSONSchema } from '../interfaces';

export class RefControlComment extends ControlComment {
  before(...args: any[]): void {
    // nothing
  }

  after(definitionName: string): IJSONSchema | void {
    this.schemaItemParams.inputSchema.$ref = definitionName;
    delete this.schemaItemParams.inputSchema.oneOf;
    delete this.schemaItemParams.inputSchema.type;
  }
}
