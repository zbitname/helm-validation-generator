<script setup lang="ts">
import { useChartStore, type IChartProps } from '@/stores/chart';
import { useFSEntryStore } from '@/stores/fsentry';
import { generateSchemaValidation } from '@zbit/helm-validation-generator';
</script>

<script lang="ts">
const fsEntryStore = useFSEntryStore();
const chartStore = useChartStore();

const readDir = (fsEntry: FileSystemEntry) => {
  return new Promise<(FileSystemDirectoryEntry | FileSystemFileEntry) []>((resolve, reject) => {
    const reader = (fsEntry as FileSystemDirectoryEntry).createReader();
    reader.readEntries((entries) => {
      resolve(entries as (FileSystemDirectoryEntry | FileSystemFileEntry) []);
    }, reject);
  });
};

const getChartProps = async (fsEntry: FileSystemEntry): Promise<IChartProps> => {
  const result: IChartProps = {
    name: fsEntry.name,
    params: {
      chartFile: null,
      ciDir: null,
      definitionsFile: null,
      deprecationsFile: null,
      schemaFile: null,
      valuesFile: null,
    },
    selectedOptions: {
      ciDir: false,
      definitionsFile: false,
      deprecationsFile: false,
    },
  };

  if (!fsEntry.isDirectory) {
    return result;
  }

  const rootEntries = await readDir(fsEntry);

  result.params.chartFile = rootEntries.find(v => v.isFile && /^chart\.ya{0,1}ml$/i.test(v.name)) as FileSystemFileEntry || null;
  result.params.ciDir = rootEntries.find(v => v.isDirectory && /^ci$/i.test(v.name)) as FileSystemDirectoryEntry || null;
  result.params.definitionsFile = rootEntries.find(v => v.isFile && /^values\.definitions\.json$/i.test(v.name)) as FileSystemFileEntry || null;
  result.params.deprecationsFile = rootEntries.find(v => v.isFile && /^values\.deprecations\.ya{0,1}ml$/i.test(v.name)) as FileSystemFileEntry || null;
  result.params.schemaFile = rootEntries.find(v => v.isFile && /^values\.schema\.json$/i.test(v.name)) as FileSystemFileEntry || null;
  result.params.valuesFile = rootEntries.find(v => v.isFile && /^values\.ya{0,1}ml$/i.test(v.name)) as FileSystemFileEntry || null;

  if (result.params.ciDir) {
    // result.selectedOptions.ciDir = true;
  }

  if (result.params.definitionsFile) {
    result.selectedOptions.definitionsFile = true;
  }

  if (result.params.deprecationsFile) {
    result.selectedOptions.deprecationsFile = true;
  }

  return result;
};

fsEntryStore.$subscribe(async (mutation, state) => {
  const result: IChartProps[] = [];

  for (const item of state.entries) {
    result.push(await getChartProps(item));
  }

  chartStore.setChartList(result);
});

const readFile = async (
  entry: FileSystemFileEntry,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    entry.file((file) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result?.toString() || '');
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsText(file);
    }, reject);
  });
}

const download = (filename: string, text: string) => {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

const generateSchemaValidationLocal = async (props: IChartProps) => {
  const contents: string[] = [];
  let definitions = '';

  if (props.params.valuesFile) {
    contents.push(await readFile(props.params.valuesFile));
  }
  if (props.params.deprecationsFile) {
    contents.push(await readFile(props.params.deprecationsFile));
  }
  if (props.params.definitionsFile) {
    definitions = JSON.parse(await readFile(props.params.definitionsFile));
  }

  download('values.schema.json', JSON.stringify(generateSchemaValidation(contents, definitions as any), null, 2));

  return 'test';
};

export default {
  data() {
    return {
      charts: chartStore.getList
    };
  },
  methods: {
    generateSchemaValidationLocal
  },
}
</script>

<template>
  <div v-for="item in charts" class="card">
    <h2>{{ item.name }}</h2>

    <p>
      <input type="checkbox" id="cb-{{ item.name }}-chartfile" :checked="Boolean(item.params.chartFile)" disabled>
      <label for="cb-{{ item.name }}-chartfile">{{ item.params.chartFile?.name || 'Unknown chart :(' }}</label>
    </p>

    <p>
      <!-- <input type="checkbox" id="cb-{{ item.name }}-cidir" v-model="item.selectedOptions.ciDir" :disabled="!item.params.ciDir"> -->
      <input type="checkbox" id="cb-{{ item.name }}-cidir" v-model="item.selectedOptions.ciDir" disabled>
      <label for="cb-{{ item.name }}-cidir">CI (soon)</label>
    </p>

    <p>
      <input type="checkbox" id="cb-{{ item.name }}-def" v-model="item.selectedOptions.definitionsFile" :disabled="!item.params.definitionsFile">
      <label for="cb-{{ item.name }}-def">Definition file <i>{{ item.params.definitionsFile?.name }}</i></label>
    </p>

    <p>
      <input type="checkbox" id="cb-{{ item.name }}-dep" v-model="item.selectedOptions.deprecationsFile" :disabled="!item.params.deprecationsFile">
      <label for="cb-{{ item.name }}-dep">Deprecation file <i>{{ item.params.deprecationsFile?.name }}</i></label>
    </p>

    <p>
      <input type="checkbox" id="cb-{{ item.name }}-schema" disabled>
      <label for="cb-{{ item.name }}-schema">Schema file <i>{{ item.params.schemaFile?.name }}</i></label>
    </p>

    <p>
      <input type="checkbox" id="cb-{{ item.name }}-values" :checked="Boolean(item.params.valuesFile)" disabled>
      <label for="cb-{{ item.name }}-values">Values file <i>{{ item.params.valuesFile?.name }}</i></label>
    </p>

    <button @click="generateSchemaValidationLocal(item)" :disabled="!item.params.chartFile || !item.params.valuesFile">Get JSONSchema file</button>
  </div>
</template>

<style>
.card {
  border-radius: 0.4rem;
  border-width: 0.1rem;
  border-style: solid;
  padding: 1rem;
  margin-top: 1rem;
  border-color: darkgray;
  width: 48%;
}
</style>
