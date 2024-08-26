export const formatDate = d => {
    const date = new Date(d);
    return {
      time: date.toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'}),
      day: date.getUTCDate(),
      weekday: date.toLocaleDateString('en-US', {weekday: 'short'})
    };
};