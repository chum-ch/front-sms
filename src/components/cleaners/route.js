import CleanerList from "./CleanerList.vue";
import CleanerDetails from "./CleanerDetails.vue";

const routes = [
  {
    path: "/cleaners",
    name: "cleaners",
    component: CleanerList,
  },
  {
    path: "/cleaners/:id",
    name: "cleaners-details",
    component: CleanerDetails,
  },
];

export default routes;
