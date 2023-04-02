/* eslint-disable no-useless-constructor */

import {
  Scalar,
} from 'yaml';

import { getTypeByValue } from './helpers';
import { DocumentItem } from './DocumentItem';
import { DocumentItemGenerator, ICodumentItemGeneratorParams } from './DocumentItemGenerator';

export class DocumentScalar extends DocumentItemGenerator<Scalar> {
  constructor(
    doc: Scalar,
    params: ICodumentItemGeneratorParams,
  ) {
    super(doc, params);
  }

  public getDocumentItem(): DocumentItem {
    return new DocumentItem({
      type: getTypeByValue(this.doc.value),
      values: [ this.doc.value ],
      path: this.path,
      ...(this.doc.comment && { comment: this.doc.comment.trim() }),
    });
  }
}
