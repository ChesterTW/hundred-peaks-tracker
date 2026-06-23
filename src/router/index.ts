import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PeakListView from "../views/PeakListView.vue";
import AddTripView from "../views/AddTripView.vue";
import TripListView from "../views/TripListView.vue";
import PeakDetailView from "../views/PeakDetailView.vue";
import EditTripView from "../views/EditTripView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: HomeView,
      children: [
        { path: "", redirect: { name: "trips" } },
        { path: "peaks", name: "peaks", component: PeakListView },
        { path: "peaks/:id", name: "peak-detail", component: PeakDetailView },
        { path: "add", name: "adds", component: AddTripView },
        { path: "edit/:id", name: "edit-trip", component: EditTripView },
        { path: "trips", name: "trips", component: TripListView },
      ],
    },
  ],
});

export default router;
