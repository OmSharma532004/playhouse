import React from 'react';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Calendar = ({ events }) => {
  
  const eventDates = events.reduce((acc, event) => {

    const date = new Date(event.timestamp).toDateString();
    acc[date] = event.spoilage;
    return acc;
  }, {});

 
  const tileContent = ({ date, view }) => {
    const dateStr = date.toDateString();
    if (view === 'month' && eventDates[dateStr]) {
      return (
        <div className="text-xs text-red-600 mt-1">
          {`Spoilage: ${eventDates[dateStr]}%`}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h3 className="text-center text-lg font-semibold text-gray-500 mb-4">
        Spoilage Events Calendar
      </h3>
      <ReactCalendar tileContent={tileContent} />
    </div>
  );
};

export default Calendar;
