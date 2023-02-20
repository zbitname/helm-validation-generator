/* eslint-disable no-useless-constructor */

import {
    Document,
    YAMLMap,
    YAMLSeq,
} from 'yaml';

import { ChartSeq } from './ChartSeq';
import { IChartItem, IChartItemGenerator } from './interfaces';
import { ChartMap } from './ChartMap';

export class ChartRoot implements IChartItemGenerator {
    constructor(
        private doc: Document,
    ) {}

    public getChartItem(): IChartItem {
        if (this.doc.contents instanceof YAMLSeq) {
            return new ChartSeq(this.doc.contents).getChartItem();
        }

        if (this.doc.contents instanceof YAMLMap) {
            return new ChartMap(this.doc.contents).getChartItem();
        }

        throw new Error('Unsupported type');
    }
}
