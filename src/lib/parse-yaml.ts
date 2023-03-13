import {
  parseAllDocuments,
} from 'yaml';

import { ChartRoot } from './classes/ChartRoot';
import { ControlCommentRepo } from './classes/ControlCommentRepo';
import { SkipControlComment } from './control-comments/skip';

const controlComment = new ControlCommentRepo();
controlComment.add('skip', SkipControlComment);

// 1st stage
export const parse = (inputChart: string) => {
  const docs = parseAllDocuments(inputChart);
  const charts: ChartRoot[] = [];

  for (const doc of docs) {
    charts.push(new ChartRoot(doc));
  }

  return charts;
};
