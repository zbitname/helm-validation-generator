import {
  IChartItem,
  IChartItemGenerator,
} from '../interfaces';

export interface IChartItemGeneratorParams {
  path: string;
  propName?: string;
}

export abstract class ChartItemGenerator<T> implements IChartItemGenerator {
  #propName?: string;
  #path: string;
  #doc: T;

  public constructor(
    doc: T,
    params?: IChartItemGeneratorParams,
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

  public abstract getChartItem(): IChartItem;
}
