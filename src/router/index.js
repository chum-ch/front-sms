import { createRouter, createWebHistory } from 'vue-router'
import DashBoard from '../components/DashBoard.vue'
import HelloWorld from '../components/HelloWorld.vue'
import SchoolsRouter from '../components/schools/route';
// import TrainersRouter from '../components/trainers/route';
// import ClassesRouter from '../components/classes/route';
import RoomsRouter from '../components/rooms/route';
// import StudentsRouter from '../components/students/route';
// import CleanersRouter from '../components/cleaners/route';
// import SchedulesRouter from '../components/schedules/route';
// import CoursesRouter from '../components/courses/route';
// import GenerationsRouter from '../components/generations/route';
// import ExamsRouter from '../components/exams/route';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  ...SchoolsRouter,
  // ...ClassesRouter,
  ...RoomsRouter,
  // ...TrainersRouter,
  // ...StudentsRouter,
  // ...CleanersRouter,
  // ...SchedulesRouter,
  // ...CoursesRouter,
  // ...GenerationsRouter,
  // ...ExamsRouter,
    {
      path: '/hello',
      name: 'hello',
      component: HelloWorld
    },
    {
      path: '/schools/:schoolId/manages',
      name: 'manages',
      component: DashBoard
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
