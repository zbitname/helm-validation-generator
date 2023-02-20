import {
    parseAllDocuments,
} from 'yaml';

import { ChartRoot } from './classes/ChartRoot';

export const parse = (inputChart: string, inputTypes: string) => {
    const docs = parseAllDocuments(inputChart);
    const charts: ChartRoot[] = [];

    for (const doc of docs) {
        charts.push(new ChartRoot(doc));
    }

    return charts;
};
