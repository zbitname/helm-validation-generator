/* eslint-disable no-useless-constructor */

import {
    Pair,
    Scalar,
    YAMLMap,
    YAMLSeq,
} from 'yaml';

import { IChartItem, IChartItemGenerator } from './interfaces';
import { ChartMap } from './ChartMap';
import { ChartSeq } from './ChartSeq';
import { getTypeByValue } from './helpers';

export class ChartPair implements IChartItemGenerator {
    constructor(
        private doc: Pair,
    ) {}

    public getChartItem(): IChartItem {
        if (!(this.doc.key instanceof Scalar)) {
            console.debug('failed pair', this.doc);
            throw new Error('Key must be Scalar type');
        }

        if (this.doc.value instanceof Scalar) {
            return {
                type: getTypeByValue(this.doc.value?.value),
                prop: this.doc.key.value,
                value: this.doc.value.value,
                ...(this.doc.value.comment && { comment: this.doc.value.comment?.trim() }),
            } as IChartItem;
        }

        if (this.doc.value instanceof Pair) {
            return new ChartPair(this.doc.value).getChartItem();
        }

        if (this.doc.value instanceof YAMLMap) {
            return new ChartMap(this.doc.value).getChartItem();
        }

        if (this.doc.value instanceof YAMLSeq) {
            return new ChartSeq(this.doc.value).getChartItem();
        }

        console.log('ChartPair.getChartItem->(this.doc.value)', this.doc.value);
        throw new Error('Unsupported type');
    }
}
