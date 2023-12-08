import RoomsList from "./RoomsList.vue";

const routes = [
  {
    path: "/schools/:schoolId/rooms",
    name: "rooms",
    component: RoomsList,
  },
  
];

export default routes;
