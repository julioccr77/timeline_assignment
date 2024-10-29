import './TimeLine.css';

import React from 'react';
import generateDates from "../../../../utils/generateDates"

const Timeline = ({ earliestDate, latestDate, numberOfPoints= 5 }) => {

    const dates  = generateDates(earliestDate, latestDate, numberOfPoints );
    return (
        <div className="timeline-line">
            {dates.map((date,index) => (
                <div key={`${date.year}-${date.monthDay}-${index}`} className="timeline-point">
                    <span className="timeline-year">{date.year}</span>
                    <span className="timeline-date">{date.monthDay}</span>
                </div>
            ))}
        </div>
    )

}

export default Timeline;
