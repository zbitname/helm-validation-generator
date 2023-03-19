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
  type: TJSONSchemaType;
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

export interface IJSONSchemaItem {
  $ref?: string;
  type?: TJSONSchemaType;
  items?: {
    oneOf?: IJSONSchemaItem[];
  };
  properties?: Record<string, {
    oneOf?: IJSONSchemaItem[];
  }>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface IJSONSchemaRoot {
  $schema: string;
  oneOf?: IJSONSchemaItem[];
  $defs?: Record<string, Omit<IJSONSchemaItem, '$ref'>>;
}

export interface ICompiledChartItem extends Pick<IChartItem, 'type' | 'path' | 'prop'> {
  pathTemplate: string;
  precompiledSchemaItem: IJSONSchemaItem;
  countThis: number;
  countOf: number;
}

export interface IChartItemGenerator {
  getChartItem(): IChartItem;
  // setControlCommentRepo(repo: IControlCommentRepo): this;
  // getControlCommentRepo(): IControlCommentRepo;
}

interface IJSONSchemaForProcessingBase {
  chartItems: IChartItemWithOptions[];
  pathTemplate: IChartItemWithOptions['pathTemplate'];
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

export interface ISchemaParams {
  readonly skipTemplatePaths: IJSONSchemaForProcessing['pathTemplate'][];
}

export interface ISchemaItemParams {
  readonly templatePath: IJSONSchemaForProcessing['pathTemplate'];
  readonly inputSchema: IJSONSchemaItem;
}

export interface IControlComment {
  schemaParams: ISchemaParams;
  schemaItemParams: ISchemaItemParams;
  before(...args: any[]): void;
  after(...args: any[]): void;
}

export type TControlCommentConstructor = new (
  schemaParams: ISchemaParams,
  schemaItemParams: ISchemaItemParams,
) => IControlComment;

export interface IControlCommentRepo {
  add(name: string, impl: TControlCommentConstructor): this;
  get(name: string): TControlCommentConstructor;
}
