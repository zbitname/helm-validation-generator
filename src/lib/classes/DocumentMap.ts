/* eslint-disable no-useless-constructor */

import {
  Pair,
  YAMLMap,
} from 'yaml';

import { IDocumentItem } from '../interfaces';
import { DocumentPair } from './DocumentPair';
import { DocumentItem } from './DocumentItem';
import { DocumentItemGenerator, ICodumentItemGeneratorParams } from './DocumentItemGenerator';

export class DocumentMap extends DocumentItemGenerator<YAMLMap> {
  constructor(
    doc: YAMLMap,
    params: ICodumentItemGeneratorParams,
  ) {
    super(doc, params);
  }

  public getDocumentItem(): DocumentItem {
    const documentItem: IDocumentItem = {
      type: 'object',
      values: [],
      children: [],
      path: this.path,
      ...(this.propName && {
        prop: this.propName,
        path: `${this.path}`,
      }),
      ...(this.doc.commentBefore && { comment: this.doc.commentBefore.trim().split('\n')[0] }),
    };

    for (let i = 0; i < this.doc.items.length; i++) {
      const item = this.doc.items[i];

      if (item instanceof Pair) {
        documentItem.children!.push(new DocumentPair(item, {
          path: this.path,
        }).getDocumentItem());
        continue;
      }

      console.error('DocumentMap.getDocumentItem->item', item);
      throw new Error('Unsupported type');
    }

    return new DocumentItem(documentItem);
  }
}
