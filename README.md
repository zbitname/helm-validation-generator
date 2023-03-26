# Comments syntax

Example of base usage
### values.yaml
```yaml
image: # schema: ref(ImageRef)
  pullPolicy: Always
  repository: curl
  tag: latest
replicas: 1
foo: bar # schema: skip
debugMode: false # schema: optional
```

### values.definitions.json
```json
{
  "ImageRef": {
    "type": "object",
    "properties": {
      "pullPolicy": {
        "type": "string",
        "enum": ["Always", "IfNotPresent"]
      },
      "repository": { "type": "string" },
      "tag": { "type": "string" }
    },
    "required": ["pullPolicy", "repository", "tag"]
  }
}
```

### values.schema.json
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "oneOf": [
    {
      "type": "object",
      "properties": {
        "debugMode": {
          "oneOf": [ { "type": "boolean" } ]
        },
        "image": {
          "oneOf": [ { "$ref": "#/$defs/ImageRef" } ]
        },
        "replicas": {
          "oneOf": [ { "type": "number" } ]
        }
      },
      "required": [ "image", "replicas" ],
      "additionalProperties": false
    }
  ],
  "$defs": {
    "ImageRef": {
      "type": "object",
      "properties": {
        "pullPolicy": {
          "type": "string",
          "enum": [ "Always", "IfNotPresent" ]
        },
        "repository": { "type": "string" },
        "tag": { "type": "string" }
      },
      "required": [ "pullPolicy", "repository", "tag" ]
    }
  }
}
```

Control comments:
* `skip`: Skip this part of YAML.
* `ref($DEFINITION)`: Replace this part of YAML to alredy defined definition.
* `optional`: Mark as optional
* `deprecated($COMMENT)`: Mark as deprecated

# TODO: Show some options as deprecated
https://github.com/search?q=repo%3Aredhat-developer%2Fyaml-language-server%20deprecation&type=code
