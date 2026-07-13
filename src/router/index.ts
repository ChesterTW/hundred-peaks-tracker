import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", redirect: "/home" },
    {
      path: "/home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/trips",
      component: () => import("../views/TripListView.vue"),
    },
    {
      path: "/peaks",
      component: () => import("../views/PeakListView.vue"),
    },
  ],
});

export default router;
