export type TJSONSchemaType = 'string' | 'number' | 'integer' | 'object' | 'array' | 'boolean' | 'null';

export type TControlFncDesc = {
  name: string;
  args: string[];
};

export type TSchemaOptions = {
  additionalProperties?: boolean;
};

export type TControlOperations = {
  skip?: boolean; // priority=10
  patchSchema?: { // priority=20
    key: string; // %ALL%: all keys
    value?: string;
    operation: 'set' | 'unset' | 'push' | 'pull';
  }[];
};

// export type TControlCommentFnc = (...args: any[]) => TControlOperators;

export interface IChartItem {
  values: any[];
  types: TJSONSchemaType[];
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

export interface IJSONSchema {
  $ref?: string;
  oneOf?: any;
  type?: TJSONSchemaType;
}

export interface IControlComment {
  getOperations(...args: any[]): TControlOperations;
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

interface IJSONSchemaForProcessingBase {
  chartItems: IChartItemWithOperations[];
  pathTemplate: IChartItemWithOperations['pathTemplate'];
}

export interface IJSONSchemaForProcessingObject extends IJSONSchemaForProcessingBase {
  type: 'object';
  properties: string[];
  required: string[];
}

export interface IJSONSchemaForProcessingNumber extends IJSONSchemaForProcessingBase {
  type: 'number';
}

export interface IJSONSchemaForProcessingString extends IJSONSchemaForProcessingBase {
  type: 'string';
}

export interface IJSONSchemaForProcessingBoolean extends IJSONSchemaForProcessingBase {
  type: 'boolean';
}

export interface IJSONSchemaForProcessingNull extends IJSONSchemaForProcessingBase {
  type: 'null';
}

export interface IJSONSchemaForProcessingArray extends IJSONSchemaForProcessingBase {
  type: 'array';
  items: (
    IJSONSchemaForProcessingObject
    | IJSONSchemaForProcessingArray
    | IJSONSchemaForProcessingNumber
    | IJSONSchemaForProcessingString
    | IJSONSchemaForProcessingBoolean
    | IJSONSchemaForProcessingNull
  )[];
}

export type IJSONSchemaForProcessing = (
  IJSONSchemaForProcessingObject
  | IJSONSchemaForProcessingArray
  | IJSONSchemaForProcessingNumber
  | IJSONSchemaForProcessingString
  | IJSONSchemaForProcessingBoolean
  | IJSONSchemaForProcessingNull
);
