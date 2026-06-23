import { watch, ref, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

export function useWeather(
  lat: MaybeRefOrGetter<number | undefined>,
  lng: MaybeRefOrGetter<number | undefined>,
) {
  const weather = ref<any>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchWeather() {
    const latVal = toValue(lat); // 每次抓「當下最新」的座標
    const lngVal = toValue(lng);
    if (latVal == null || lngVal == null) return;

    loading.value = true;
    error.value = null;

    try {
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latVal}&longitude=${lngVal}` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code` +
        `&timezone=Asia/Taipei&forecast_days=3`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("天氣服務回應異常");
      weather.value = await res.json();
    } catch (e) {
      error.value = "無法取得天氣資料";
    } finally {
      loading.value = false;
    }
  }

  watch(() => [toValue(lat), toValue(lng)], fetchWeather, { immediate: true });

  return { weather, loading, error, fetchWeather };
}
