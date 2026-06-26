export interface DistancePoint {
  lon: number;
  lat: number;
  distanceKm: number;
}

export interface TrailDistance {
  points: DistancePoint[];
  totalKm: number;
}

// 計算兩點間的公尺數
function haversine(a: [number, number], b: [number, number]): number {
  // a, b 都是 [經度, 緯度]
  // 公式（直接用）：
  //   R = 6371000 (地球半徑, 公尺)
  //   把 lat 差、lon 差轉成弧度 (度 * Math.PI / 180)
  //   h = sin²(Δlat/2) + cos(lat1)*cos(lat2)*sin²(Δlon/2)
  //   距離 = 2 * R * asin(sqrt(h))

  const R = 6371000; // 地球半徑, 公尺
  const lat1 = a[1] * (Math.PI / 180);
  const lat2 = b[1] * (Math.PI / 180);
  const deltaLat = (b[1] - a[1]) * (Math.PI / 180);
  const deltaLon = (b[0] - a[0]) * (Math.PI / 180);

  const h =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

  const distance = 2 * R * Math.asin(Math.sqrt(h));

  return distance; // 公尺
}

// 計算一串經緯度的累積距離
export function cumulativeDistances(coords: [number, number][]): TrailDistance {
  // coords 是陣列，每個元素都是 [經度, 緯度]
  const points: DistancePoint[] = [];

  let totalDistance = 0;

  for (let i = 0; i < coords.length; i++) {
    const [lon, lat] = coords[i];
    if (i > 0) {
      const prevCoord = coords[i - 1];
      const distance = haversine(prevCoord, [lon, lat]);
      totalDistance += distance;
    }
    points.push({
      lon,
      lat,
      distanceKm: totalDistance / 1000, // 轉成公里
    });
  }

  return {
    points,
    totalKm: totalDistance / 1000, // 轉成公里
  };
}

// 將 GeoJSON 的 geometry 轉成經緯度陣列
export function geometryToCoords(geometry: {
  type: string;
  coordinates: any;
}): [number, number][] {
  if (geometry.type === "LineString") {
    // LineString: 直接回傳 coordinates
    return geometry.coordinates as [number, number][];
  } else if (geometry.type === "MultiLineString") {
    // MultiLineString: 把多段攤平成一段（可能是由多條不連續的線段組成，是數據源與應用邏輯的折衷）
    return geometry.coordinates.flat() as [number, number][];
  } else {
    throw new Error(`Unsupported geometry type: ${geometry.type}`);
  }
}
