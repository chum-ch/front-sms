import ClassesList from "./ClassesList.vue";

const routes = [
  {
    path: "/schools/:schoolId/classes",
    name: "classes",
    component: ClassesList,
  },
  
];

export default routes;
