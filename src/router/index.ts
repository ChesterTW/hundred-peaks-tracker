import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PeakListView from "../views/PeakListView.vue";
import AddTripView from "../views/AddTripView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/peaks", name: "peaks", component: PeakListView },
    { path: "/add", name: "adds", component: AddTripView },
  ],
});

export default router;
