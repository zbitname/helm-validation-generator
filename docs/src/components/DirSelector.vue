<script setup lang="ts">
import { useFSEntryStore } from '@/stores/fsentry';
</script>

<script lang="ts">
export default {
  methods: {
    dropHandler(event: DragEvent) {
      event.preventDefault();
      (event.target as HTMLParagraphElement).className = '';

      const fsEntry = useFSEntryStore();

      for (let i = 0; i < (event.dataTransfer?.items.length || 0); i++) {
        const item = event.dataTransfer?.items[i];
        const entry = item?.webkitGetAsEntry();

        if (entry) {
          fsEntry.addEntry(entry);
        }
      }
    },
    dragOverHandler(event: DragEvent) {
      event.preventDefault();
      (event.target as HTMLParagraphElement).className = 'ondrag';
    },
    dragLeaveHandler(event: DragEvent) {
      event.preventDefault();
      (event.target as HTMLParagraphElement).className = '';
    },
  },
}
</script>

<template>
  <div
    id="drop_zone"
    draggable="true"
    @drop="dropHandler($event)"
    @dragover="dragOverHandler($event)"
    @dragleave="dragLeaveHandler($event)"
    @dragenter.prevent
    @dragover.prevent
    @dragleave.prevent
  >
    Drop your charts <i>here</i>.
  </div>
</template>

<style>
#drop_zone {
  border: 5px solid hsla(160, 100%, 37%, 0.2);
  width: 100%;
  height: 10rem;
  padding: 4rem 0 0 0;
  text-align: center;
  margin-top: 2rem;
}

#drop_zone.ondrag {
  border: 5px dotted hsla(160, 100%, 37%, 1);
}
</style>
