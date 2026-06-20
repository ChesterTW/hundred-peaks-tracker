import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PeakListView from "../views/PeakListView.vue";
import AddTripView from "../views/AddTripView.vue";
import TripListView from "../views/TripListView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: HomeView,
      children: [
        { path: "", redirect: { name: "trips" } },
        { path: "peaks", name: "peaks", component: PeakListView },
        { path: "add", name: "adds", component: AddTripView },
        { path: "trips", name: "trips", component: TripListView },
      ],
    },
  ],
});

export default router;
