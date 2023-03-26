import {
  IDocumentItem,
  IDocumentItemWithOptions,
  TControlFncDesc,
  TJSONSchemaType,
} from '../interfaces';

export class DocumentItem implements IDocumentItemWithOptions {
  public readonly values: any[];
  public readonly type: TJSONSchemaType;
  public readonly path: string;
  public readonly pathTemplate: string;
  public readonly prop?: string;
  public readonly children?: IDocumentItemWithOptions[] = [];
  public readonly comment?: string | null = null;
  public readonly options?: TControlFncDesc[] = [];

  constructor(
    _doc: IDocumentItem,
  ) {
    if (_doc.prop === null) {
      this.prop = 'null';
    } else {
      this.prop = _doc.prop;
    }

    this.values = _doc.values;
    this.type = _doc.type;
    this.path = _doc.path;
    this.pathTemplate = _doc.path.replace(/\[\d+\]/g, '.[]');
    this.children = _doc.children as IDocumentItemWithOptions[];
    this.comment = _doc.comment;

    this.options = this.getParsedComment();
  }

  private getParsedComment(): TControlFncDesc[] | undefined {
    const match = this.comment?.match(/^schema:\s*([\w\d;\s()./]+)/i);

    if (!match || !match[1]) {
      return;
    }

    const functions = match[1].split(/(?<!\\);/).map(i => i.trim()).filter(Boolean);
    const parsedCommentArray: TControlFncDesc[] = functions.map(i => {
      const parsedFnc = i.match(/^([\w\d]+)(?:\(([\w\d\s,/.]+)\))*/i);

      if (!parsedFnc || !parsedFnc[1]) {
        throw new Error(`Incorrect syntax of "${i}" function`);
      }

      return {
        name: parsedFnc[1],
        args: parsedFnc[2]?.split(/(?<!\\),/).map(i => i.trim()) || [],
      };
    });

    return parsedCommentArray;
  }
}
