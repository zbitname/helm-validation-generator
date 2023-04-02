<script setup lang="ts">
import DirSelector from '../components/DirSelector.vue'
import ChartCandidateList from '../components/ChartCandidateList.vue'
import { useFSEntryStore } from '@/stores/fsentry';
</script>

<script lang="ts">
export default {
  data() {
    const fsEntry = useFSEntryStore();

    return {
      showDirSelector: () => fsEntry.isEmpty,
    };
  }
}
</script>

<template>
  <div class="grid">
    <ChartCandidateList />
  </div>
  <DirSelector />
</template>

<style>
.grid {
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>
