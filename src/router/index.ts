import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PeakListView from "../views/PeakListView.vue";
import TripListView from "../views/TripListView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: HomeView,
      children: [
        { path: "", redirect: { name: "home" } },
        { path: "home", name: "home", component: HomeView },
        { path: "peaks", name: "peaks", component: PeakListView },
        { path: "trips", name: "trips", component: TripListView },
      ],
    },
  ],
});

export default router;
