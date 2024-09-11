import React from 'react';

interface Seat {
  id: string;
  seatNumber: string;
  type: string;
  price: number;
  status: string;
}

interface SeatPickerProps {
  seats: Seat[];
  selectedSeats: Seat[];
  handleSeatSelection: (seat: Seat) => void;
}

const SeatPicker: React.FC<SeatPickerProps> = ({ seats, selectedSeats, handleSeatSelection }) => {
  const groupedSeats = (type: string) => seats.filter((seat) => seat.type === type);

  return (
    <div className="space-y-6 w-full lg:w-3/4">
      {/* VIP Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">VIP</h2>
        <div className="grid grid-cols-10 gap-2">
          {groupedSeats("VIP").map((seat) => (
            <button
              key={seat.id}
              className={`p-2 border rounded ${
                seat.status === "BLOCKED"
                  ? "bg-gray-400 cursor-not-allowed"
                  : selectedSeats.some((s) => s.id === seat.id)
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
              onClick={() => handleSeatSelection(seat)}
            >
              {seat.seatNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Premium Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Premium</h2>
        <div className="grid grid-cols-10 gap-2">
          {groupedSeats("PREMIUM").map((seat) => (
            <button
              key={seat.id}
              className={`p-2 border rounded ${
                seat.status === "BLOCKED"
                  ? "bg-gray-400 cursor-not-allowed"
                  : selectedSeats.some((s) => s.id === seat.id)
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
              onClick={() => handleSeatSelection(seat)}
            >
              {seat.seatNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Standard Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Standard</h2>
        <div className="grid grid-cols-10 gap-2">
          {groupedSeats("STANDARD").map((seat) => (
            <button
              key={seat.id}
              className={`p-2 border rounded ${
                seat.status === "BLOCKED"
                  ? "bg-gray-400 cursor-not-allowed"
                  : selectedSeats.some((s) => s.id === seat.id)
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
              onClick={() => handleSeatSelection(seat)}
            >
              {seat.seatNumber}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatPicker;