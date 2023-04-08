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

export default {
  data() {
    return {
      example1_values: '',
      example1_valuesOriginal: '',
      example1_schema: '',
      useSkip: true,
      useCompactMode: true,
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
    toggleUseSkip(): undefined {
      if (this.$data.useSkip) {
        this.$data.example1_values = this.$data.example1_values.replace(/image:\n/g, 'image: # schema: skip\n');
      } else {
        this.$data.example1_values = this.$data.example1_valuesOriginal;
      }

      if (this.$data.example1_values) {
        this._updateSchema();
      }

      return;
    },
    toggleCompactMode(): undefined {
      if (this.$data.example1_values) {
        this._updateSchema();
      }

      return;
    },
    _updateSchema() {
      this.$data.example1_schema = JSON.stringify(
        generateSchemaValidation(
          [this.$data.example1_values],
          {},
          undefined,
          {compact: this.$data.useCompactMode}
        ),
        null, 2
      );
    }
  },
  async created() {
    const [vals] = await Promise.all([
      (await fetch('/src/assets/examples/1.values.yaml')).text(),
    ]);
    this.$data.example1_values = this.$data.example1_valuesOriginal = vals;
  }
}
</script>

<template>
  <h1>Using of control-comments (hints)</h1>
  <p>Input:</p>
  <div>
    <prism-editor :highlight="highlighterYaml" v-model="example1_values" line-numbers :readonly="true"></prism-editor>
  </div>
  <p>
    <input type="checkbox" id="use-skip" v-model="useSkip" :on-change="toggleUseSkip()"> <label for="use-skip">Use "skip"</label>
    &nbsp;
    <input type="checkbox" id="use-compact" v-model="useCompactMode" :on-change="toggleCompactMode()"> <label for="use-compact">Compact mode</label>
  </p>
  <p>Output:</p>
  <prism-editor :highlight="highlighterJson" v-model="example1_schema" line-numbers :readonly="true"></prism-editor>
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
