import { IControlComment, IControlCommentRepo } from '../interfaces';

export class ControlCommentRepo implements IControlCommentRepo {
  private funcs: Record<string, new () => IControlComment> = {};

  add(name: string, impl: new () => IControlComment): this {
    this.funcs[name] = impl;

    return this;
  }

  get(name: string): new () => IControlComment {
    if (!this.funcs[name]) {
      throw new Error(`Unknown function "${name}"`);
    }

    return this.funcs[name];
  }
}
