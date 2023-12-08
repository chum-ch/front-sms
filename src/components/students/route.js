import StudentsList from "./StudentsList.vue";
import AllStudentsInSchool from "./AllStudentsInSchool.vue";
import StudentsDetails from "./StudentDetails.vue";
const routes = [

  {
    path: "/schools/:schoolId/students",
    name: "students-in-school",
    component: AllStudentsInSchool,
  },
  {
    path: "/schools/:schoolId/generations/:generationId/students",
    name: "students",
    component: StudentsList,
  },
  {
    path: "/schools/:schoolId/generations/:generationId/students/:studentId",
    name: "students-details",
    component: StudentsDetails,
  },
];

export default routes;
