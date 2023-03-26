import {
  IDocumentItem,
  IDocumentItemGenerator,
} from '../interfaces';

export interface ICodumentItemGeneratorParams {
  path: string;
  propName?: string;
}

export abstract class DocumentItemGenerator<T> implements IDocumentItemGenerator {
  #propName?: string;
  #path: string;
  #doc: T;

  public constructor(
    doc: T,
    params?: ICodumentItemGeneratorParams,
  ) {
    this.#propName = params?.propName;
    this.#path = params?.path || '';
    this.#doc = doc;
  }

  get propName() {
    return this.#propName;
  }

  get path() {
    return this.#path;
  }

  get doc() {
    return this.#doc;
  }

  public abstract getDocumentItem(): IDocumentItem;
}
