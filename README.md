# Comments syntax

Example
```yaml
someYAML: value # schema: skip
```

Control comments:
* `skip`: Skip this part of YAML.
* `ref($DEFINITION)`: Replace this part of YAML to alredy defined definition.
* `enum(...$VALUES)`: TODO. This options can be applied only for strings, without symbols `[",", "(", ")"]`.
* `allowAdditionalProperties`: TODO. This options can be applied only for objects.

Flow:
* `items = (yaml-to-schema).parse(content: String);` Parse YAML
* `flat = (flatten).flatten([], items[0].getChartItem(): IChartItem);` Make flat from tree
* `flatWithOperators = (operationFiller).fill(flat, controlCommentRepo);` Fill operations to all items
* `schemaItems = (flatShemaGenerator).getJSONSchemaFromFlat(flatWithOperators);` Make "schema" from flat items with operations
* `TODO` Apply all operations for each item
* `TODO` Make JSON Schema
