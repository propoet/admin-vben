import { acceptHMRUpdate, defineStore } from 'pinia';

export interface DictItem {
  colorType?: string;
  cssClass?: string;
  label: string;
  value: string;
}

export type Dict = Record<string, DictItem[]>;

interface DictState {
  dictCache: Dict;
}

export const useDictStore = defineStore('core-dict', {
  actions: {
    getDictData(dictType: string, value: any) {
      const dict = this.dictCache[dictType];
      if (!dict) {
        return undefined;
      }
      return (
        dict.find((d) => d.value === value || d.value === value.toString()) ??
        undefined
      );
    },
    getDictOptions(dictType: string) {
      const dictOptions = this.dictCache[dictType];
      if (!dictOptions) {
        return [];
      }
      return dictOptions;
    },
    setDictCache(dicts: Dict) {
      this.dictCache = dicts;
    },
    setDictCacheByApi(
      api: (params: Record<string, any>) => Promise<Record<string, any>[]>,
      params: Record<string, any> = {},
      labelField: string = 'label',
      valueField: string = 'value',
    ) {
      api(params).then((dicts) => {
        // 将dicts 根据children 拍平 转成  {dictType: "ai_generate_mode", value: "1", label: "歌词模式", colorType: "", cssClass: ""} 形式,
        const dictData:any[] = []
        for(const dict of dicts){
          const dictType = dict?.code;
          dict.children.forEach((item: any)=>{
            dictData.push({
              dictType: dictType,
              value: item.value,
              label: item.label,
              colorType: item.colorType,
              cssClass: item.cssClass,
            })
          })
        }
        const dictCacheData: Dict = {};
        dictData.forEach((dict) => {
          dictCacheData[dict.dictType] = dictData
            .filter((d) => d.dictType === dict.dictType)
            .map((d) => ({
              colorType: d.colorType,
              cssClass: d.cssClass,
              label: d[labelField],
              value: d[valueField],
            }));
        });
        this.setDictCache(dictCacheData);
      });
    },
  },
  persist: {
    // 持久化
    pick: ['dictCache'],
  },
  state: (): DictState => ({
    dictCache: {},
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useDictStore, hot));
}
