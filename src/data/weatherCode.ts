import type { WeatherInfo } from "../types";

const weatherCodeMap: Record<number, WeatherInfo> = {
  0: { label: "晴", icon: "☀️" },
  1: { label: "晴時多雲", icon: "🌤️" },
  2: { label: "多雲", icon: "⛅" },
  3: { label: "陰", icon: "☁️" },
  45: { label: "霧", icon: "🌫️" },
  48: { label: "凍霧", icon: "🌫️" },
  51: { label: "毛毛雨（弱）", icon: "🌦️" },
  53: { label: "毛毛雨（中）", icon: "🌦️" },
  55: { label: "毛毛雨（強）", icon: "🌦️" },
  56: { label: "凍毛雨（弱）", icon: "🌧️" },
  57: { label: "凍毛雨（強）", icon: "🌧️" },
  61: { label: "小雨", icon: "🌧️" },
  63: { label: "中雨", icon: "🌧️" },
  65: { label: "大雨", icon: "🌧️" },
  66: { label: "凍雨（弱）", icon: "🌧️" },
  67: { label: "凍雨（強）", icon: "🌧️" },
  71: { label: "小雪", icon: "🌨️" },
  73: { label: "中雪", icon: "🌨️" },
  75: { label: "大雪", icon: "❄️" },
  77: { label: "米雪", icon: "🌨️" },
  80: { label: "陣雨（弱）", icon: "🌦️" },
  81: { label: "陣雨（中）", icon: "🌧️" },
  82: { label: "陣雨（強）", icon: "⛈️" },
  85: { label: "陣雪（弱）", icon: "🌨️" },
  86: { label: "陣雪（強）", icon: "❄️" },
  95: { label: "雷雨", icon: "⛈️" },
  96: { label: "雷雨夾冰雹（弱）", icon: "⛈️" },
  99: { label: "雷雨夾冰雹（強）", icon: "⛈️" },
};

export function getWeatherInfo(code: number): WeatherInfo {
  return weatherCodeMap[code] ?? { label: "未知", icon: "❓" };
}
