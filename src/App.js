import './App.css';

import React, { useState } from 'react';

import TimelineEvents from './components/TimelineEvents/TimelineEvents';
import timelineItems from './constants/timelineItems';

function App() {
  const [events, setEvents] = useState(timelineItems);
  const handleUpdateEvent = (updatedEvent) => {
    setEvents(events.map(event =>
        event.id === updatedEvent.id ? updatedEvent : event
    ));
};
  return (
    <div className="App">
      <TimelineEvents events={events} onUpdateEvent={handleUpdateEvent}/>
    </div>
  );
}

export default App;
