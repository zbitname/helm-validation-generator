/* eslint-disable n/no-path-concat */
/* eslint-env mocha */

import { expect } from 'chai';
import { generateSchemaValidation } from '../src';

describe('Readme', () => {
  it('Example of base usage', () => {
    const content = `
    image: # schema: ref(ImageRef)
      pullPolicy: Always
      repository: curl
      tag: latest
    replicas: 1
    foo: bar # schema: skip
    debugMode: false # schema: optional
    `;
    const schema = generateSchemaValidation([content], {
      "ImageRef": {
        "type": "object",
        "properties": {
          "pullPolicy": {
            "type": "string",
            "enum": ["Always", "IfNotPresent"]
          },
          "repository": {
            "type": "string"
          },
          "tag": {
            "type": "string"
          }
        },
        "required": ["pullPolicy", "repository", "tag"]
      }
    });
    // console.log(JSON.stringify(schema, null, 2));
    expect(schema).to.deep.equals({
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
    });
  });
});
