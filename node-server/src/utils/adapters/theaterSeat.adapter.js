export class TheaterSeatAdapter {
    static adapt(screeningDTO) {
      const result = {};
      
      screeningDTO.theater.seats.forEach(seat => {
        const row = seat.row;
        if (!result[row]) {
          result[row] = [];
        }
        
        result[row].push({
          id: `${seat.row}${seat.number}`,
          disabled: screeningDTO.occupiedSeats.some(occupiedSeat => 
            occupiedSeat.row === seat.row && occupiedSeat.number === seat.number
          ),
          isVIP: seat.type === 'vip'
        });
      });
  
      return result;
    }
  }