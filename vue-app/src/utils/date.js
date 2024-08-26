export function formatMovieShowtime(dateString) {
    const showtimeDate = new Date(dateString);

const optionsDate = { 
  weekday: 'short', 
  day: 'numeric', 
  month: 'short', 
  year: 'numeric'
};

const optionsTime = { 
  hour: '2-digit', 
  minute: '2-digit', 
  hourCycle: 'h23'
};

const formattedDate = showtimeDate.toLocaleDateString('en-EN', optionsDate).replace(',', '').replace(',', ' ').replace(',', ' ');
const formattedTime = showtimeDate.toLocaleTimeString('en-EN', optionsTime);

return `${formattedDate}, ${formattedTime}`;
}