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
      valuesStr: '',
      valuesOriginalStr: '',
      defsStr: '',
      schemaStr: '',
      useDefs: true,
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
    toggleUseDefs(): undefined {
      if (this.$data.useDefs) {
        this.$data.valuesStr = this.$data.valuesStr.replace(/image:\n/g, 'image: # schema: ref(Image)\n');
      } else {
        this.$data.valuesStr = this.$data.valuesOriginalStr;
      }

      if (this.$data.valuesStr && this.$data.defsStr) {
        this._updateSchema();
      }

      return;
    },
    toggleCompactMode(): undefined {
      if (this.$data.valuesStr && this.$data.defsStr) {
        this._updateSchema();
      }

      return;
    },
    _updateSchema() {
      this.$data.schemaStr = JSON.stringify(
        generateSchemaValidation(
          [this.$data.valuesStr],
          JSON.parse(this.$data.defsStr),
          undefined,
          {compact: this.$data.useCompactMode}
        ),
        null, 2
      );
    }
  },
  async created() {
    const [vals, defs] = await Promise.all([
      (await fetch(`${this.$data.baseUrl}src/assets/examples/1.values.yaml`)).text(),
      (await fetch(`${this.$data.baseUrl}src/assets/examples/1.defs.json`)).text(),
    ]);
    this.$data.valuesStr = this.$data.valuesOriginalStr = vals;
    this.$data.defsStr = defs;
  }
}
</script>

<template>
  <h1>Using of control-comments (hints)</h1>
  <p>Input:</p>
  <div>
    <prism-editor :highlight="highlighterYaml" v-model="valuesStr" line-numbers :readonly="true" class="example1_values"></prism-editor>
    <prism-editor :highlight="highlighterJson" v-model="defsStr" line-numbers :readonly="true"></prism-editor>
  </div>
  <p>
    <input type="checkbox" id="use-defs" v-model="useDefs" :on-change="toggleUseDefs()"> <label for="use-defs">Use definitions</label>
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

.example1_values {
  width: 30rem;
}
</style>
