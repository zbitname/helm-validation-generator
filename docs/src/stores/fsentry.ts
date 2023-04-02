import { acceptHMRUpdate, defineStore } from 'pinia';

export const useFSEntryStore = defineStore({
  id: 'fsentry',
  state: () => ({
    entries: [] as FileSystemEntry[],
  }),
  actions: {
    addEntry(entry: FileSystemEntry): void {
      const idx = this.entries.map(i => i.name).indexOf(entry.name);

      if (idx >= 0) {
        this.entries.splice(idx, 1);
      }

      this.entries.push(entry);
    },
  },
  getters: {
    getEntries: (state): FileSystemEntry[] => {
      return state.entries;
    },
    isEmpty: (state): boolean => {
      return state.entries.length === 0;
    },
  },
});

// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useFSEntryStore, import.meta.hot))
// }
