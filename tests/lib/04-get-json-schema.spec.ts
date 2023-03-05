/* eslint-disable n/no-path-concat */
/* eslint-env mocha */

import { readFileSync } from 'fs';
import { expect } from 'chai';

import { parse } from '../../src/lib/yaml-to-schema';
import { flatten } from '../../src/lib/flatten';
import { fill } from '../../src/lib/operationFiller';
import { ControlCommentRepo } from '../../src/lib/classes/ControlCommentRepo';
import { SkipControlComment } from '../../src/lib/control-comments/skip';
import { getJSONSchemaFromFlat } from '../../src/lib/shemaGenerator';

describe('Get JSON schema from flat', () => {
  const controlCommentRepo = new ControlCommentRepo();
  controlCommentRepo.add('skip', SkipControlComment);

  it('file=different-types-in-one-item.yaml', () => {
    const content = readFileSync(`${__dirname}/files/different-types-in-one-item.yaml`).toString();
    const res = parse(content);
    const flat = flatten([], res[0].getChartItem());
    const flatWithOperators = fill(flat, controlCommentRepo);
    const schema = getJSONSchemaFromFlat(flatWithOperators);
  });
});
