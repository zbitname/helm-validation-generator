import {
  parseAllDocuments,
} from 'yaml';

import { ChartRoot } from './classes/ChartRoot';

// 1st stage
export const parse = (inputChart: string) => {
  const docs = parseAllDocuments(inputChart);
  const charts: ChartRoot[] = [];

  for (const doc of docs) {
    charts.push(new ChartRoot(doc));
  }

  return charts;
};
