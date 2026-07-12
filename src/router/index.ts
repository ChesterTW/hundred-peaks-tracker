import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PeakListView from "../views/PeakListView.vue";
import TripListView from "../views/TripListView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", redirect: "/home" },
    {
      path: "/home",
      component: HomeView,
    },
    {
      path: "/trips",
      component: TripListView,
    },
    {
      path: "/peaks",
      component: PeakListView,
    },
  ],
});

export default router;
