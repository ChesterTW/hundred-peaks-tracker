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

export type RouteType = "單攻" | "連峰" | "縱走" | "多日";

// 路線
export interface Route {
  id: string;
  name: string;
  type: RouteType;
  peakIds: number[];
  trailheadId: string;
  trackId: string;
  waypointIds: string[];
  days: number;
  overnightWaypointIds: string[];
  distanceKm: number;
  totalTimeMinutes: number;
  difficulty: number;
}

// 軌跡(GPX 離線解析結果)
export interface Track {
  id: string;
  points: [number, number, number][]; // [lat, lng, ele] 密集折線
}

// 節點(trail-intrinsic,與路線無關)
export interface Waypoint {
  id: string;
  name: string; // 例「向陽山屋」
  kind: "trailhead" | "hut" | "peak" | "junction" | "lake" | "other";
  lat: number;
  lng: number;
  elevation: number;
  distanceFromStart: number; // km,投影到 track 上的累計距離
  segmentTimeFromPrev: number; // 分鐘,上河圖到「序列中前一個」節點的耗時(登山口為 0)
}

// 登山口
export interface Trailhead {
  id: string;
  name: string; // 例「向陽登山口」
  lat: number;
  lng: number;
}
