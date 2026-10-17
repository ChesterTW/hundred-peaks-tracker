import type { BaseLayer } from "../types";

// CARTO 自 2026/9/25 起點陣圖磚必須帶 key，本機與正式站使用不同的 key
const CARTO_API_KEY = import.meta.env.VITE_CARTO_API_KEY;
const cartoKeyQuery = CARTO_API_KEY
  ? `?key=${encodeURIComponent(CARTO_API_KEY)}`
  : "";

export const baseLayers: BaseLayer[] = [
  {
    id: "carto",
    name: "CARTO Light Map",
    url: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png${cartoKeyQuery}`,
    attribution: "© OpenStreetMap contributors © CARTO",
    maxZoom: 20,
  },
  {
    id: "osm",
    name: "OSM",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap",
    maxZoom: 19,
  },
  {
    id: "esri",
    name: "衛星",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles © Esri",
    maxZoom: 19,
  },
  {
    id: "nlsc",
    name: "航照",
    url: "https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/EPSG:3857/{z}/{y}/{x}",
    attribution: "© 內政部國土測繪中心",
    maxZoom: 20,
  },
];
