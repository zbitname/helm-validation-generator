# Comments syntax

Example
```yaml
someYAML: value # schema: skip
```

Control comments:
* `skip`: Skip this part of YAML.
* `ref($DEFINITION)`: Replace this part of YAML to alredy defined definition.
* `optional`: Mark as optional
* `deprecated($COMMENT)`: Mark as deprecated

# TODO: Show some options as deprecated
https://github.com/search?q=repo%3Aredhat-developer%2Fyaml-language-server%20deprecation&type=code
