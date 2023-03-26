import { ControlComment } from '../classes/ControlComment';

export class OptionalControlComment extends ControlComment {
  before(...args: any[]): void {
    // nothing
  }

  after(...args: any[]): void {
    this.schemaItemParams.inputCompiledDocumentItem.optional = true;
  }
}
