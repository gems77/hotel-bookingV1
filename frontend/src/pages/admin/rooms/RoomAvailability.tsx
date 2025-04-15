import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Room, RoomAvailability, RoomType } from "../../../models/types";

const ToggleSwitch = ({
  isOn,
  onToggle,
  loading = false,
}: {
  isOn: boolean;
  onToggle: () => void;
  loading?: boolean;
}) => {
  return (
    <button
      onClick={onToggle}
      disabled={loading}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        isOn ? "bg-green-500" : "bg-red-500"
      } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`${
          isOn ? "translate-x-6" : "translate-x-1"
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
      />
    </button>
  );
};

export default function RoomAvailabilityManager() {
  const { hotelId, roomId } = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [roomType, setRoomType] = useState<RoomType | null>(null);
  const [availabilityData, setAvailabilityData] = useState<RoomAvailability[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const generateCalendarDays = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push(dateStr);
    }

    return days;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedRooms: Room[] = JSON.parse(
          localStorage.getItem(`hotelRooms_${hotelId}`) || "[]"
        );

        const selectedRoom = storedRooms.find((r) => r.id === Number(roomId));
        if (!selectedRoom) {
          console.error("Room not found");
          setLoading(false);
          return;
        }

        const storedRoomTypes: RoomType[] = JSON.parse(
          localStorage.getItem("roomTypes") || "[]"
        );

        const selectedRoomType = storedRoomTypes.find(
          (rt) => rt.id === selectedRoom.roomTypeId
        );

        if (!selectedRoomType) {
          console.error("Room type not found");
          setLoading(false);
          return;
        }

        setRoom(selectedRoom);
        setRoomType(selectedRoomType);

        const storageKey = `roomAvailability_${roomId}_${selectedMonth}`;
        const storedAvailability = localStorage.getItem(storageKey);

        if (storedAvailability) {
          setAvailabilityData(JSON.parse(storedAvailability));
        } else {
          const days = generateCalendarDays();
          const newAvailability: RoomAvailability[] = days.map((date) => ({
            id: Math.floor(Math.random() * 1000),
            roomId: Number(roomId),
            date,
            isAvailable: true,
            price: selectedRoomType.basePrice,
          }));

          setAvailabilityData(newAvailability);
          localStorage.setItem(storageKey, JSON.stringify(newAvailability));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [hotelId, roomId, selectedMonth]);

  const handleAvailabilityChange = (date: string) => {
    setAvailabilityData((prevData) => {
      const updatedData = prevData.map((item) =>
        item.date === date ? { ...item, isAvailable: !item.isAvailable } : item
      );

      const storageKey = `roomAvailability_${roomId}_${selectedMonth}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedData));

      return updatedData;
    });
  };

  const handlePriceChange = (date: string, price: number) => {
    if (price <= 0) return;

    setAvailabilityData((prevData) => {
      const updatedData = prevData.map((item) =>
        item.date === date ? { ...item, price } : item
      );

      const storageKey = `roomAvailability_${roomId}_${selectedMonth}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedData));

      return updatedData;
    });
  };

  const handleSave = () => {
    alert("Modifications sauvegardées avec succès");
  };

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (!room || !roomType)
    return <div className="text-center py-8">Chambre non trouvée</div>;

  const calendarDays = generateCalendarDays();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Gérer la disponibilité</h1>
      <p className="mb-6">
        Chambre {room.roomNumber} - {roomType.name} (Prix de base:{" "}
        {roomType.basePrice}€)
      </p>

      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="month"
        >
          Sélectionner un mois
        </label>
        <input
          type="month"
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="bg-white shadow-md rounded overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-100 text-center font-semibold">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 p-2">
          {calendarDays.map((dateStr, index) => {
            const date = new Date(dateStr);
            const dayOfWeek = date.getDay();
            const dayOfMonth = date.getDate();

            if (index === 0) {
              const firstDayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
              const emptyDays = Array(firstDayOffset).fill(null);

              return [
                ...emptyDays.map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                )),
                <DayCell
                  key={dateStr}
                  date={dateStr}
                  day={dayOfMonth}
                  availability={availabilityData.find(
                    (a) => a.date === dateStr
                  )}
                  onAvailabilityChange={handleAvailabilityChange}
                  onPriceChange={handlePriceChange}
                />,
              ];
            }

            return (
              <DayCell
                key={dateStr}
                date={dateStr}
                day={dayOfMonth}
                availability={availabilityData.find((a) => a.date === dateStr)}
                onAvailabilityChange={handleAvailabilityChange}
                onPriceChange={handlePriceChange}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Enregistrer les changements
        </button>
      </div>
    </div>
  );
}

function DayCell({
  date,
  day,
  availability,
  onAvailabilityChange,
  onPriceChange,
}: {
  date: string;
  day: number;
  availability?: RoomAvailability;
  onAvailabilityChange: (date: string) => void;
  onPriceChange: (date: string, price: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState(availability?.price || 0);

  if (!availability) {
    return (
      <div className="p-2 bg-gray-100 min-h-16 flex flex-col items-center justify-center">
        <span className="font-bold">{day}</span>
        <span className="text-xs">Chargement...</span>
      </div>
    );
  }

  const handlePriceSubmit = () => {
    if (price > 0) {
      onPriceChange(date, price);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`p-2 border ${availability.isAvailable ? "bg-green-50" : "bg-red-50"} min-h-16 flex flex-col`}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold">{day}</span>
        <ToggleSwitch
          isOn={availability.isAvailable}
          onToggle={() => onAvailabilityChange(date)}
        />
      </div>

      {isEditing ? (
        <div className="mt-1">
          <input
            type="number"
            min="1"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            onBlur={handlePriceSubmit}
            onKeyDown={(e) => e.key === "Enter" && handlePriceSubmit()}
            className="w-full px-1 py-0.5 text-xs border rounded"
            autoFocus
          />
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="text-center mt-1 text-sm cursor-pointer hover:bg-gray-100"
        >
          {price}€
        </div>
      )}
    </div>
  );
}
