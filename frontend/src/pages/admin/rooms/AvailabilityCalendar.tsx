import { useState, useEffect } from "react";
import { RoomAvailability } from "../../../models/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AvailabilityCalendarProps {
  roomId: number;
}

export default function AvailabilityCalendar({
  roomId,
}: AvailabilityCalendarProps) {
  const [availabilityData, setAvailabilityData] = useState<RoomAvailability[]>(
    []
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const date = new Date();
    // Début du mois
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = () => {
      try {
        const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;
        const storageKey = `roomAvailability_${roomId}_${monthKey}`;
        const storedData = localStorage.getItem(storageKey);

        if (storedData) {
          setAvailabilityData(JSON.parse(storedData));
        } else {
          // Créer des données par défaut si elles n'existent pas
          const daysInMonth = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() + 1,
            0
          ).getDate();

          const defaultData: RoomAvailability[] = [];

          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              day
            );

            defaultData.push({
              id: day,
              roomId,
              date: date.toISOString().split("T")[0],
              isAvailable: true,
              price: 0, // Le prix sera mis à jour après
            });
          }

          setAvailabilityData(defaultData);
          localStorage.setItem(storageKey, JSON.stringify(defaultData));
        }
      } catch (error) {
        console.error("Error loading availability data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [roomId, currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleToggleAvailability = (date: string) => {
    const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;
    const storageKey = `roomAvailability_${roomId}_${monthKey}`;

    const updatedData = availabilityData.map((item) =>
      item.date === date ? { ...item, isAvailable: !item.isAvailable } : item
    );

    setAvailabilityData(updatedData);
    localStorage.setItem(storageKey, JSON.stringify(updatedData));
  };

  const handlePriceChange = (date: string, newPrice: number) => {
    if (newPrice < 0) return;

    const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;
    const storageKey = `roomAvailability_${roomId}_${monthKey}`;

    const updatedData = availabilityData.map((item) =>
      item.date === date ? { ...item, price: newPrice } : item
    );

    setAvailabilityData(updatedData);
    localStorage.setItem(storageKey, JSON.stringify(updatedData));
  };

  const renderCalendarDays = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <p>Chargement...</p>
        </div>
      );
    }

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Ajustement pour commencer la semaine par lundi
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const days = [];

    // Jours vides en début de mois
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split("T")[0];
      const dayData = availabilityData.find((d) => d.date === dateString) || {
        isAvailable: true,
        price: 0,
      };

      days.push(
        <div
          key={day}
          className={`p-2 border rounded-lg ${
            dayData.isAvailable ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium">{day}</span>
            <button
              onClick={() => handleToggleAvailability(dateString)}
              className={`text-xs px-2 py-1 rounded ${
                dayData.isAvailable
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {dayData.isAvailable ? "Dispo" : "Indispo"}
            </button>
          </div>
          <div className="mt-1">
            <input
              type="number"
              value={dayData.price}
              onChange={(e) =>
                handlePriceChange(dateString, Number(e.target.value))
              }
              className="w-full px-1 py-0.5 text-xs border rounded"
              min="0"
            />
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-semibold">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
          <div key={day} className="text-center font-medium text-sm py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

      <div className="mt-4 flex justify-between text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
          <span>Indisponible</span>
        </div>
      </div>
    </div>
  );
}
