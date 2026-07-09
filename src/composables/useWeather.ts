import { watch, ref, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

interface WeatherResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weather_code: number[];
    sunrise: string[];
    sunset: string[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation: number[];
    weather_code: number[];
  };
  current: {
    relative_humidity_2m: number;
    surface_pressure: number;
    wind_speed_10m: number;
  };
}

interface AirQualityResponse {
  current: {
    us_aqi: number;
    pm2_5: number;
    uv_index: number;
  };
}

export function useWeather(
  lat: MaybeRefOrGetter<number | undefined>,
  lng: MaybeRefOrGetter<number | undefined>,
) {
  const weather = ref<WeatherResponse | null>(null);
  const airQuality = ref<AirQualityResponse | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchWeather() {
    const latVal = toValue(lat); // 每次抓「當下最新」的座標
    const lngVal = toValue(lng);
    if (latVal == null || lngVal == null) return;

    loading.value = true;
    error.value = null;

    try {
      // 天氣的 API
      const weatherUrl =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latVal}&longitude=${lngVal}` +
        // 每日彙總（10 天）
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,sunrise,sunset` +
        // 逐小時（未來 24 小時）
        `&hourly=temperature_2m,precipitation,weather_code` +
        // 即時彙總（今日）
        `&current=relative_humidity_2m,surface_pressure,wind_speed_10m` +
        `&models=jma_seamless` +
        `&timezone=Asia/Taipei&forecast_days=10&forecast_hours=24`;

      // 空氣品質與紫外線強度的 API
      // 注意：這不是使用 JMA SEAMLESS，而是使用 Open-Meteo 的 Air Quality API。
      const aqiUrl =
        `https://air-quality-api.open-meteo.com/v1/air-quality` +
        `?latitude=${latVal}&longitude=${lngVal}` +
        `&current=us_aqi,pm2_5,uv_index&timezone=Asia/Taipei`;

      const [res, aqiRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(aqiUrl).catch(() => null),
      ]);

      if (!res.ok) throw new Error("天氣服務回應異常");
      weather.value = await res.json();
      airQuality.value = aqiRes?.ok ? await aqiRes.json() : null;
    } catch (e) {
      error.value = "無法取得天氣資料";
    } finally {
      loading.value = false;
    }
  }

  watch(() => [toValue(lat), toValue(lng)], fetchWeather, { immediate: true });

  return { weather, airQuality, loading, error, fetchWeather };
}
