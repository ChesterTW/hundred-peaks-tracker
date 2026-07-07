import type { BaseLayer } from "../types";

export const baseLayers: BaseLayer[] = [
  {
    id: "carto",
    name: "CARTO Light Map",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: "© OpenStreetMap © CARTO",
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
