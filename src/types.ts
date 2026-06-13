// 百岳山峰
export interface Peak {
  id: number;
  name: string;
  elevation: number;
  region: string;
  aliases?: string[];
}

// 登山行程
export interface Trip {
  id: string;
  date: string; // YYYY-MM-DD
  peakIds: number[]; // 可以登多座 Peak
  note?: string;
}
