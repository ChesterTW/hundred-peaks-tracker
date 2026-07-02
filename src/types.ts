// 百岳山峰
export interface Peak {
  id: number;
  name: string;
  elevation: number;
  region: string;
  range: string; // 山脈
  lat: number; // 緯度
  lng: number; // 經度
  aliases?: string[];
  difficulty: string; // 分級（難度）
  rating: {
    physical: number; // 體能等級
    risk: number; // 風險等級
  };
}

// 登山行程
export interface Trip {
  id: string;
  date: string; // YYYY-MM-DD
  peakIds: number[]; // 可以登多座 Peak
  note?: string;
  updatedAt: number;
  deleted?: boolean;
}

// 天氣資訊
export interface WeatherInfo {
  label: string; // 中文描述
  icon: string; // emoji
}

// 地圖圖層
export interface BaseLayer {
  id: string; // 'carto' | 'osm' | 'esri' | 'nlsc-photo'
  name: string; // 圖層名稱，例如「魯地圖」「衛星」
  url: string; // tile 模板
  attribution: string;
  maxZoom?: number;
}
