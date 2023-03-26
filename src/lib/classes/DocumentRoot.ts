/* eslint-disable no-useless-constructor */

import {
  Document,
  YAMLMap,
  YAMLSeq,
} from 'yaml';

import { DocumentSeq } from './DocumentSeq';
import { DocumentMap } from './DocumentMap';
import { DocumentItem } from './DocumentItem';
import { DocumentItemGenerator } from './DocumentItemGenerator';

export class DocumentRoot extends DocumentItemGenerator<Document> {
  constructor(
    doc: Document,
  ) {
    super(doc);
  }

  public getDocumentItem(): DocumentItem {
    if (this.doc.contents instanceof YAMLSeq) {
      return new DocumentSeq(this.doc.contents, {
        path: ''
      }).getDocumentItem();
    }

    if (this.doc.contents instanceof YAMLMap) {
      return new DocumentMap(this.doc.contents, {
        path: ''
      }).getDocumentItem();
    }

    throw new Error('Unsupported type');
  }
}
