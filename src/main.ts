import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "@vuepic/vue-datepicker/dist/main.css";
import "leaflet/dist/leaflet.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/noto-sans-tc/400.css";
import "@fontsource/noto-sans-tc/500.css";
import "@fontsource/noto-sans-tc/600.css";
import "@fontsource/noto-sans-tc/700.css";

createApp(App).use(createPinia()).use(router).mount("#app");
