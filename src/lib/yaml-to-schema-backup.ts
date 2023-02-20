import { Pair, YAMLMap, Scalar, YAMLSeq, parseAllDocuments } from 'yaml';

interface IItem {
    types: Array<'scalar' | 'array' | 'object'>;
    values?: Array<any>;
    children?: Record<string, IItem>;
}

const addUniq = (arr: any[] | undefined, value: any): void => {
    if (!arr) {
        return;
    }

    if (!arr.includes(value)) {
        arr.push(value);
    }
};

const parseNode = (pair: Pair, root: IItem): void => {
    if (pair instanceof Scalar) {
        addUniq(root.types, 'scalar');

        if (!root.values) {
            root.values = [];
        }

        addUniq(root.values, pair.value);
        return;
    }

    if (pair.key) {
        if (!(pair.key instanceof Scalar)) {
            console.debug('failed pair', pair);
            throw new Error('Key must be Scalar type');
        }

        if (pair.value instanceof Scalar) { // Boolean, String, Number, null
            const type = 'scalar';

            if (!root.children) {
                root.children = {};
            }

            if (!root.children[pair.key.value]) {
                root.children[pair.key.value] = {
                    types: [type],
                    values: [],
                };
            } else {
                addUniq(root.children[pair.key.value].types, type);
            }

            addUniq(root.children[pair.key.value].values, pair.value.value);
            return;
        }

        if (pair.value instanceof YAMLSeq) { // Array
            const type = 'array';

            if (!root.children) {
                root.children = {};
            }

            if (!root.children[pair.key.value]) {
                root.children[pair.key.value] = {
                    types: [type],
                    values: [],
                };
            } else {
                addUniq(root.children[pair.key.value].types, type);
            }
            return;
        }

        if (pair.value instanceof YAMLMap) { // Object
            const type = 'object';

            if (!root.children) {
                root.children = {};
            }

            if (!root.children[pair.key.value]) {
                root.children[pair.key.value] = {
                    types: [type],
                    values: [],
                };
            } else {
                addUniq(root.children[pair.key.value].types, type);
            }
            return;
        }
    } else {
        if (pair instanceof YAMLSeq) {
            console.log('caught YAMLSeq', pair);
            return;
        }

        if (pair instanceof YAMLMap) {
            console.log('caught YAMLMap', pair);
            return;
        }
    }

    console.log('Uncaught pair', pair);

    throw new Error('Unsopported value');
};

export const parse = (inputChart: string, inputTypes: string) => {
    const docs = parseAllDocuments(inputChart);

    if (docs.length > 1) {
        throw new Error('I can parse only 1-document yaml files...');
    }

    const doc = docs[0];
    const res: IItem = {
        types: []
    };

    if (!doc?.contents) {
        return undefined;
    }

    for (let pair of (doc.contents as YAMLMap).items) {
        parseNode(pair, res);
    }

    return res;
};
