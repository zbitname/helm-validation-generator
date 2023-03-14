import { IControlCommentRepo, TControlCommentConstructor } from '../interfaces';

export class ControlCommentRepo implements IControlCommentRepo {
  private items: Record<string, TControlCommentConstructor> = {};

  add(name: string, impl: TControlCommentConstructor): this {
    this.items[name] = impl;

    return this;
  }

  get(name: string): TControlCommentConstructor {
    if (!this.items[name]) {
      throw new Error(`Unknown control-comment "${name}"`);
    }

    return this.items[name];
  }
}
