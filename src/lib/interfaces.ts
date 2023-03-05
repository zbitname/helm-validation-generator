export type TItemValue = 'number' | 'string' | 'bigint' | 'boolean' | 'undefined' | 'array' | 'object' | 'null' | 'unknown';

export type TControlFncDesc = {
  name: string;
  args: string[];
};

export type TSchemaOptions = {
  additionalProperties?: boolean;
};

export type TControlOperations = {
  skip?: boolean; // priority=1
  // patchSchema?: {
  //   key: string;
  //   value?: string;
  //   operation: 'set' | 'unset' | 'push' | 'pull';
  // }[];
};

// export type TControlCommentFnc = (...args: any[]) => TControlOperators;

export interface IChartItem {
  values: any[];
  types: TItemValue[];
  path: string;
  prop?: string;
  children?: IChartItem[];
  comment?: string | null;
}

export interface IChartItemWithOptions extends IChartItem {
  pathTemplate: string;
  options?: TControlFncDesc[];
  children?: IChartItemWithOptions[];
}

export interface IChartItemWithOperations extends IChartItemWithOptions {
  operations: TControlOperations;
  children?: IChartItemWithOperations[];
}

export interface IControlComment {
  compile(...args: any[]): TControlOperations;
}

export interface IControlCommentRepo {
  add(name: string, impl: new () => IControlComment): this;
  get(name: string): new () => IControlComment | undefined;
}

export interface IChartItemGenerator {
  getChartItem(): IChartItem;
  // setControlCommentRepo(repo: IControlCommentRepo): this;
  // getControlCommentRepo(): IControlCommentRepo;
}
