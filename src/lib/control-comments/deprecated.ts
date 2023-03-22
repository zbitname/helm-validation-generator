import { ControlComment } from '../classes/ControlComment';
import { IJSONSchemaRoot } from '../interfaces';

export class DeprecatedControlComment extends ControlComment {
  before(...args: any[]): void {
    // nothing
  }

  after(comment?: string): IJSONSchemaRoot | void {
    this.schemaItemParams.inputSchema.deprecated = true;
    if (comment) {
      this.schemaItemParams.inputSchema.description = comment;
    }
  }
}
