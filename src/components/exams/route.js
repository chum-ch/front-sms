import ExamList from "./ExamList.vue";
import ExamDetails from "./ExamDetails.vue";
const routes = [
  {
    path: "/schools/:schoolId/exams",
    name: "exams",
    component: ExamList,
  },
  {
    path: "/schools/:schoolId/exams/:examId",
    name: "exam-details",
    component: ExamDetails,
  },
  
];

export default routes;
