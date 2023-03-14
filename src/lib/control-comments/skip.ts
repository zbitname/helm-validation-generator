import { ControlComment } from '../classes/ControlComment';

export class SkipControlComment extends ControlComment {
  before(...args: any[]): void {
    this.schemaParams.skipTemplatePaths.push(this.schemaItemParams.templatePath);
  }

  after(...args: any[]): void {
    // nothing
  }
}
