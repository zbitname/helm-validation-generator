/* eslint-disable no-useless-constructor */

import {
  Scalar,
  YAMLMap,
  YAMLSeq,
} from 'yaml';

import { IDocumentItem } from '../interfaces';
import { DocumentScalar } from './DocumentScalar';
import { DocumentMap } from './DocumentMap';
import { DocumentItem } from './DocumentItem';
import { DocumentItemGenerator, ICodumentItemGeneratorParams } from './DocumentItemGenerator';

export class DocumentSeq extends DocumentItemGenerator<YAMLSeq> {
  constructor(
    doc: YAMLSeq,
    params: ICodumentItemGeneratorParams,
  ) {
    super(doc, params);
  }

  public getDocumentItem(): DocumentItem {
    const documentItem: IDocumentItem = {
      type: 'array',
      values: [],
      children: [],
      path: this.path,
      ...(this.propName && {
        prop: this.propName,
      }),
    };

    if (this.doc.commentBefore) {
      documentItem.comment = this.doc.commentBefore.trim().split('\n')[0];
    }

    for (let i = 0; i < this.doc.items.length; i++) {
      const item = this.doc.items[i];

      if (item instanceof Scalar) {
        documentItem.children!.push(new DocumentScalar(item, {
          path: `${this.path}[${i}]`,
        }).getDocumentItem());
        continue;
      }

      if (item instanceof YAMLSeq) {
        documentItem.children!.push(new DocumentSeq(item, {
          path: `${this.path}[${i}]`,
        }).getDocumentItem());
        continue;
      }

      if (item instanceof YAMLMap) {
        documentItem.children!.push(new DocumentMap(item, {
          path: `${this.path}[${i}]`,
        }).getDocumentItem());
        continue;
      }

      // console.error('CodumentSeq.getDocumentItem->item', item);
      throw new Error('Unsupported type');
    }

    return new DocumentItem(documentItem);
  }
}
