<template>
  <div>
    <FullCalendar class="w-100" :options="calendarOptions" :events="events" />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import multiMonthPlugin from '@fullcalendar/multimonth'
import { defineComponent } from 'vue'
export default defineComponent({
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin, multiMonthPlugin],
        // Fuction
        // dateClick: this.handleDateClick,
        // Time
        timeZone: 'Asia/Phnom_Penh', // Set the timezone to Cambodia
        slotMinTime: '06:00:00',
        slotMaxTime: '24:00:00',
        // View
        initialView: 'timeGridWeek',
        // Other
        expandRows: true,
        height: 650,
        handleWindowResize: true,
        // navLinks: false, // can click day/week names to navigate views
        // weekNumbers:true,
        // editable: true,
        // selectable: true,
        nowIndicator: true,
        dayMaxEvents: true, // allow "more" link when too many events
        allDaySlot: false, // Disable the all-day slot

        // Events
        // Get calendar event form parent
        eventClick: this.editEventCalendar,
        eventDidMount: function (info) {
          const teacher = info.event.extendedProps.teacherName
          const roomName = info.event.extendedProps.roomName
          const className = info.event.extendedProps.className
          info.el.querySelector('.fc-event-title').innerHTML +=
            `<div class="">${roomName}</div><br>${className}<br>${teacher}`
        },
        events: [
          {
            title: '',
            start: '',
            end: '',
            extendedProps: {
              className: '',
              teacherName: '',
              roomName: ''
            }
          }
          // {
          //   title: "Vue js",
          //   start: "2023-06-09T07:30:00",
          //   end: "2023-06-09T09:00:00",
          // },
          // {
          //   title: "event 1",
          //   date: "2023-06-10",
          // },
          // { title: "event 2", start: "2023-06-14T07:30:00" },
          // {
          //   title: "Birthday Party",
          //   start: "2023-06-11T00:00:00",
          //   end: "2023-06-11T24:00:00",
          //   backgroundColor: "green",
          // },
        ],

        // Toolbar
        titleFormat: { year: 'numeric', month: 'short', day: 'numeric' },
        headerToolbar: {
          // left: "today,timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear,listMonth",
          start: 'prev,next today timeGridWeek',
          end: 'dayGridMonth,multiMonthYear',
          center: 'title'
        },
        views: {
          timeGridWeek: { buttonText: 'week' },
          multiMonthYear: { buttonText: 'Year' },
          dayGridMonth: { buttonText: 'Month' }
          //   dayGridWeek: { buttonText: "Week" },
          //   listMonth: { buttonText: "Event" },
        }
      }
    }
  },
  emits: ['updateEvent'],
  props: {
    events: Array
  },
  watch: {},
  updated() {
    this.displayEvent()
  },
  created() {
    this.displayEvent()
  },
  methods: {
    editEventCalendar(info) {
      this.$emit('updateEvent', info.event._def)
    },
    displayEvent() {
      if (this.events) {
        this.calendarOptions.events = this.events
      }
    },
    handleDateClick: function (arg) {
      console.log(arg)
    }
  }
})
</script>
<style>
.fc-event-title-container {
  padding: 5px;
  /* font-size: 12px; */
}
.fc .fc-col-header-cell-cushion,
.fc-timegrid-axis-cushion,
.fc-daygrid-day-number {
  text-decoration: none;
  color: gray;
}
.fc-event-time {
  display: none;
}

@media (max-width: 500px) {
  .fc .fc-dayGridMonth-button,
  .fc .fc-multiMonthYear-button,
  .fc .fc-timeGridWeek-button {
    display: none;
  }
  .fc .fc-toolbar-title {
    font-size: 15px;
  }
}
</style>
