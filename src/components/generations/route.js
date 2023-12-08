import GenerationsList from "./GenerationsList.vue";
import GenerationDetails from "./GenerationDetails.vue";
const routes = [
  {
    path: "/schools/:schoolId/generations",
    name: "generations",
    component: GenerationsList,
  },
  {
    path: "/schools/:schoolId/generations/:generationId",
    name: "generation-details",
    component: GenerationDetails,
  },
  
];

export default routes;
