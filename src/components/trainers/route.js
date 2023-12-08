import TrainersList from "./TrainersList.vue";
import TrainerDetails from "./TrainerDetails.vue";

const routes = [
  {
    path: "/schools/:schoolId/trainers",
    name: "trainers",
    component: TrainersList,
  },
  {
    path: "/schools/:schoolId/trainers/:id",
    name: "trainers-details",
    component: TrainerDetails,
  },
];

export default routes;
