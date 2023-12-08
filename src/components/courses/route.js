import CoursesList from "./CoursesList.vue";

const routes = [
  {
    path: "/schools/:schoolId/courses",
    name: "courses",
    component: CoursesList,
  },
  
];

export default routes;
