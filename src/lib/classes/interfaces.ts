export type TItemValue = 'number' | 'string' | 'bigint' | 'boolean' | 'undefined' | 'array' | 'object' | 'null' | 'unknown';

export interface IChartItem {
    value: any;
    type: TItemValue;
    prop?: string;
    children?: IChartItem[];
    comment?: string | null;
}

export interface IChartItemGenerator {
    getChartItem(): IChartItem;
}
