import './TimelineEvents.css';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import Draggable from 'react-draggable';
import Timeline from './components/TimeLine/TimeLine';
import { Tooltip } from 'react-tooltip';
import ZoomControls from '../ZoomControls/ZoomControls';

const TimelineEvents = ({ events, onUpdateEvent, title="List of Events" }) => {
    const [zoomFactor, setZoomFactor] = useState(1);
    const [containerWidth, setContainerWidth] = useState(0);
    const [editingEventId, setEditingEventId] = useState(null);
    const [eventNames, setEventNames] = useState({});

    const containerRef = useRef(null);

    const eventRefs = useMemo(() => events.map(() => React.createRef()), [events]);

    const parsedEvents = useMemo(() =>
        events.map(event => ({
        ...event,
        startDate: new Date(event.start),
        endDate: new Date(event.end),
    })).sort((a, b) => a.startDate - b.startDate), [events] )
    
    
    const earliestDate = parsedEvents[0]?.startDate || new Date();;
    const latestDate = parsedEvents.reduce((latest, event) =>
        event.endDate > latest ? event.endDate : latest, parsedEvents[0].endDate);

    const calculatePosition = (date) =>
        (((date - earliestDate) / (latestDate - earliestDate)) * 100) / zoomFactor;

    const zoomIn = () => setZoomFactor(prev => Math.max(prev - 0.1, 0.1));
    const zoomOut = () => setZoomFactor(prev => prev + 0.1);

    const handleNameChange = (id, newName) => {
        setEventNames((prev) => ({ ...prev, [id]: newName }));
    };

    const handleNameBlur = (id) => {
        setEditingEventId(null);
        const updatedEvent = events.find(event => event.id === id);
        if (updatedEvent && updatedEvent.name !== eventNames[id]) {
            onUpdateEvent({ ...updatedEvent, name: eventNames[id] });
        }
    };
    
    const handleDragStop = (e, data, event) => {
        const millisecondsPerPixel  = ((latestDate - earliestDate) / (24 * 60 * 60 * 1000)) / (zoomFactor * containerWidth);
        const newStartDate = new Date(event.startDate.getTime() + millisecondsPerPixel  * data.x);
        const newEndDate = new Date(event.endDate.getTime() + millisecondsPerPixel );

        onUpdateEvent({
            ...event,
            start: newStartDate.toISOString().split('T')[0],
            end: newEndDate.toISOString().split('T')[0]
        });
    };

    
    const lanes = [];
    const assignedLanes = parsedEvents.map(event => {
        let laneIndex = 0;
        while (laneIndex < lanes.length) {
            const lastEventInLane = lanes[laneIndex][lanes[laneIndex].length - 1];
            if (lastEventInLane.endDate < event.startDate) {
            
                break;
            }
            laneIndex++;
        }

        if (laneIndex === lanes.length) {
            lanes.push([]);
        }

        lanes[laneIndex].push(event);
        return laneIndex;
    });

    useEffect(() => {
        const initialEventNames = events.reduce((acc, event) => {
            acc[event.id] = event.name;
            return acc;
        }, {});
        setEventNames(initialEventNames);
    }, [events]);
    
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div ref={containerRef}>
            <div>
                <h1>{title}</h1>
            </div>
            <ZoomControls zoomIn={zoomIn} zoomOut={zoomOut}/>
            <Timeline earliestDate={earliestDate} latestDate={latestDate}/>
            <div className="timeline-container">
                {parsedEvents.map((event, index) => {                    
                    const startPercent = calculatePosition(event.startDate);
                    const endPercent = calculatePosition(event.endDate);
                    const widthPercent = endPercent - startPercent;
                    const laneIndex = assignedLanes[index];

                    return (
                        <React.Fragment key={event.id}>
                            <Draggable
                                key={event.id}
                                nodeRef={eventRefs[index]}
                                axis="x"
                                onStop={(e, data) => handleDragStop(e, data, event)}
                                bounds="parent"                                
                            >
                                <div
                                    ref={eventRefs[index]}
                                    className="timeline-event"
                                    style={{
                                        left: `${startPercent}%`,
                                        width: `${Math.max(widthPercent, 2)}%`,
                                        top: `${laneIndex * 60}px`,
                                    }}
                                    data-tooltip-id={ widthPercent<=5 ? `tooltip-${index}` : null} 
                                    data-tooltip-content={`${event.name}`}
                                    
                                >
                                    {editingEventId === event.id ? (
                                        <input
                                            type="text"
                                            value={eventNames[event.id]}
                                            onChange={(e) => handleNameChange(event.id, e.target.value)}
                                            onBlur={() => handleNameBlur(event.id)}
                                            autoFocus
                                        />
                                    ) : (
                                        <span onDoubleClick={() => setEditingEventId(event.id)}>
                                            {eventNames[event.id]}
                                        </span>
                                    )}
                                </div>
                            </Draggable>
                            <Tooltip id={`tooltip-${index}`} place="top" style={{ backgroundColor: '#333', color: '#fff' }} />
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default TimelineEvents;
