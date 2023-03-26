import {
  parseAllDocuments,
} from 'yaml';

import { DocumentRoot } from './classes/DocumentRoot';

// 1st stage
export const parse = (input: string) => {
  const docs = parseAllDocuments(input);
  const documentItems: DocumentRoot[] = [];

  for (const doc of docs) {
    documentItems.push(new DocumentRoot(doc));
  }

  return documentItems;
};
