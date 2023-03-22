import { ControlComment } from '../classes/ControlComment';
import { IJSONSchemaRoot } from '../interfaces';

export class DeprecatedControlComment extends ControlComment {
  before(...args: any[]): void {
    // nothing
  }

  after(...args: any[]): IJSONSchemaRoot | void {
    this.schemaItemParams.inputSchema.deprecated = true;
  }
}
