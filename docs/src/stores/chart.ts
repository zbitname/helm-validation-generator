import { acceptHMRUpdate, defineStore } from 'pinia';

export interface IChartProps {
  name: string;
  params: {
    chartFile: FileSystemFileEntry | null;
    ciDir: FileSystemDirectoryEntry | null;
    definitionsFile: FileSystemFileEntry | null;
    deprecationsFile: FileSystemFileEntry | null;
    schemaFile: FileSystemFileEntry | null;
    valuesFile: FileSystemFileEntry | null;
  };
  selectedOptions: {
    ciDir: boolean;
    definitionsFile: boolean;
    deprecationsFile: boolean;
  };
}

export const useChartStore = defineStore({
  id: 'chart',
  state: () => ({
    charts: [] as IChartProps[],
  }),
  actions: {
    setChartList(chartProps: IChartProps[]) {
      this.charts.length = 0;
      this.charts.push(...chartProps);
    },
  },
  getters: {
    getList: (state): IChartProps[] => {
      return state.charts;
    },
  },
});

// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useFSEntryStore, import.meta.hot))
// }
