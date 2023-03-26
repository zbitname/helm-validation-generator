/* eslint-disable no-useless-constructor */

import {
  Pair,
  Scalar,
  YAMLMap,
  YAMLSeq,
} from 'yaml';

import { DocumentMap } from './DocumentMap';
import { DocumentSeq } from './DocumentSeq';
import { getTypeByValue } from './helpers';
import { DocumentItem } from './DocumentItem';
import { DocumentItemGenerator, ICodumentItemGeneratorParams } from './DocumentItemGenerator';

const buildPathKey = (key: string) => {
  let k = key;
  if (k === null) {
    k = 'null';
  }
  return k.replace(/\./g, '\\.');
};

export class DocumentPair extends DocumentItemGenerator<Pair> {
  constructor(
    doc: Pair,
    params: ICodumentItemGeneratorParams,
  ) {
    super(doc, params);
  }

  public getDocumentItem(): DocumentItem {
    if (!(this.doc.key instanceof Scalar)) {
      // console.debug('failed pair', this.doc);
      throw new Error('Key must be Scalar type');
    }

    if (this.doc.value instanceof Scalar) {
      const path = `${this.path}.${buildPathKey(this.doc.key.value)}`;

      return new DocumentItem({
        prop: this.doc.key.value,
        type: getTypeByValue(this.doc.value?.value),
        values: [ this.doc.value.value ],
        path,
        ...(this.doc.value.comment && { comment: this.doc.value.comment?.trim() }),
      });
    }

    if (this.doc.value instanceof Pair) {
      return new DocumentPair(this.doc.value, {
        path: this.path,
      }).getDocumentItem();
    }

    if (this.doc.value instanceof YAMLMap) {
      return new DocumentMap(this.doc.value, {
        propName: this.doc.key.value,
        path: `${this.path}.${buildPathKey(this.doc.key.value)}`,
      }).getDocumentItem();
    }

    if (this.doc.value instanceof YAMLSeq) {
      return new DocumentSeq(this.doc.value, {
        propName: this.doc.key.value,
        path: `${this.path}.${buildPathKey(this.doc.key.value)}`,
      }).getDocumentItem();
    }

    // console.error('DocumentPair.getDocumentItem->(this.doc.value)', this.doc.value);
    throw new Error('Unsupported type');
  }
}
