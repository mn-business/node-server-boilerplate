import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';

export function worklogsCalendar(elementId, callbackCalendarDateClick, callbackCalendarEventClick) {
  let calendarEl = document.getElementById(elementId);
  const now = new Date().toJSON().slice(0, 10).replace(/-/g, '-');

  let calendar = new Calendar(calendarEl, {
    locale: 'ko',
    plugins: [interactionPlugin, dayGridPlugin, listPlugin, timeGridPlugin],
    dayHeaderClassNames: function (args) {
      const day = args.date.getDay(); // 요일 번호 (0: 일요일, 1: 월요일, ...)
      // 요일에 따라 클래스를 지정하여 스타일을 적용합니다.
      if (day === 0) {
        return 'text-red-700'; // 일요일은 빨간색
      } else if (day === 6) {
        return 'text-blue-700'; // 토요일은 파란색
      }
    },
    dayCellClassNames: function (args) {
      const day = args.date.getDay(); // 요일 번호 (0: 일요일, 1: 월요일, ...)
      // 요일에 따라 클래스를 지정하여 스타일을 적용합니다.
      if (day === 0) {
        return 'text-red-700'; // 일요일은 빨간색
      } else if (day === 6) {
        return 'text-blue-700'; // 토요일은 파란색
      }
    },
    initialDate: now,
    now: now,
    editable: true, // enable draggable events
    selectable: true,
    droppable: false,
    dateClick: function (info) {
      callbackCalendarDateClick(info);
      // alert('Clicked on: ' + info.dateStr);
      // alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
      // alert('Current view: ' + info.view.type);
      // // change the day's background color just for fun
      // info.dayEl.style.backgroundColor = 'red';
    },
    eventClick: function (info) {
      callbackCalendarEventClick(info);
    },
    eventDidMount: function (info) {
      if (info.el.classList.contains('line-through')) {
        const eventEl = info.el.querySelector('.fc-event-title');
        // 이벤트 텍스트에 취소선 스타일 추가
        eventEl.classList = 'line-through';
      }
    },
    eventOrder: 'sortIdx',
    aspectRatio: 1.8,
    scrollTime: '00:00', // undo default 6am scrollTime
    headerToolbar: {
      // left: 'today prev,next',
      left: null,
      center: 'title',
      // right: 'timeGridWeek,dayGridMonth,listWeek',
    },
    initialView: 'dayGridMonth',
    views: {
      month: {
        titleFormat: { year: 'numeric', month: '2-digit' },
      },
    }, // views: {
    //   resourceTimelineThreeDays: {
    //     type: 'resourceTimeline',
    //     duration: { days: 3 },
    //     buttonText: '3 day',
    //   },
    // },
  });

  calendar.render();
  return calendar;
}
