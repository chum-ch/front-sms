import ScheduleList from "./ScheduleList.vue";

const routes = [
  {
    path: "/schools/:schoolId/schedules",
    name: "schedules",
    component: ScheduleList,
  },
];

export default routes;
