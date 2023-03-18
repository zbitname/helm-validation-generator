import { ControlComment } from '../classes/ControlComment';
import { IJSONSchemaRoot, IJSONSchemaItem } from '../interfaces';

export class RefControlComment extends ControlComment {
  before(...args: any[]): void {
    // nothing
  }

  after(definitionName: string): IJSONSchemaRoot | void {
    for (const key in this.schemaItemParams.inputSchema) {
      delete this.schemaItemParams.inputSchema[key as keyof IJSONSchemaItem];
    }

    this.schemaItemParams.inputSchema.$ref = `#/$def/${definitionName}`;
    this.schemaParams.skipTemplatePaths.push(this.schemaItemParams.templatePath + '.');
  }
}
