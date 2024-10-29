const generateDates = (startDate, endDate, intervals) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const intervalDates = [];
  
    const intervalMillis = (end - start) / (intervals - 1);
  
    for (let i = 0; i < intervals; i++) {
      const date = new Date(start.getTime() + intervalMillis * i);
      const year = date.getFullYear();
      const monthDay = date.toLocaleDateString("en-GB", { day: '2-digit', month: 'short' });
      intervalDates.push({ year, monthDay });
    }
  
    return intervalDates;
  };

  export default generateDates;