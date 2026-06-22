import { ref } from "vue";

export function useWeather(lat?: number, lng?: number) {
  const weather = ref<any>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchWeather() {
    if (lat == null || lng == null) return;

    loading.value = true;
    error.value = null;

    try {
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${lat}&longitude=${lng}` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
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

  return { weather, loading, error, fetchWeather };
}
