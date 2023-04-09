<script setup lang="ts">
</script>

<script lang="ts">
import { generateSchemaValidation } from '@zbit/helm-validation-generator';
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere
// import highlighting library (you can use any library you want just return html string)
import prismjs from 'prismjs';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.min.css'; // import syntax highlighting styles

import chartValues from '../../assets/examples/1.values.yaml?raw';

export default {
  data() {
    return {
      valuesStr: chartValues,
      valuesOriginalStr: chartValues,
      schemaStr: '',
      useOptional: true,
      useCompactMode: true,
      baseUrl: import.meta.env.BASE_URL,
    };
  },
  components: {
    PrismEditor,
  },
  methods: {
    highlighterYaml(code: string) {
      return prismjs.highlight(code, prismjs.languages.yaml, 'yaml');
    },
    highlighterJson(code: string) {
      return prismjs.highlight(code, prismjs.languages.json, 'json');
    },
    toggleUseOptional(): undefined {
      if (this.$data.useOptional) {
        this.$data.valuesStr = this.$data.valuesStr.replace(/image:\n/g, 'image: # schema: optional\n');
      } else {
        this.$data.valuesStr = this.$data.valuesOriginalStr;
      }

      if (this.$data.valuesStr) {
        this._updateSchema();
      }

      return;
    },
    toggleCompactMode(): undefined {
      if (this.$data.valuesStr) {
        this._updateSchema();
      }

      return;
    },
    _updateSchema() {
      this.$data.schemaStr = JSON.stringify(
        generateSchemaValidation(
          [this.$data.valuesStr],
          {},
          undefined,
          {compact: this.$data.useCompactMode}
        ),
        null, 2
      );
    }
  }
}
</script>

<template>
  <h1>Using of control-comments (hints)</h1>
  <p>Input:</p>
  <div>
    <prism-editor :highlight="highlighterYaml" v-model="valuesStr" line-numbers :readonly="true"></prism-editor>
  </div>
  <p>
    <input type="checkbox" id="use-optional" v-model="useOptional" :on-change="toggleUseOptional()"> <label for="use-optional">Use "optional"</label>
    &nbsp;
    <input type="checkbox" id="use-compact" v-model="useCompactMode" :on-change="toggleCompactMode()"> <label for="use-compact">Compact mode</label>
  </p>
  <p>Output:</p>
  <prism-editor :highlight="highlighterJson" v-model="schemaStr" line-numbers :readonly="true"></prism-editor>
</template>

<style scoped>
div {
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
}

* {
  font-family: monospace;
}
</style>
