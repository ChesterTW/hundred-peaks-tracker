// 百岳山峰
export interface Peak {
  id: number;
  name: string;
  elevation: number;
  region: string;
  lat: number; // 緯度
  lng: number; // 經度
  aliases?: string[];
  difficulty: number; // 分級（難度）
}

// 登山行程
export interface Trip {
  id: string;
  date: string; // YYYY-MM-DD
  peakIds: number[]; // 可以登多座 Peak
  note?: string;
}

// 天氣資訊
export interface WeatherInfo {
  label: string; // 中文描述
  icon: string; // emoji
}
