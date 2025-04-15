import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Room, RoomType, Hotel, RoomAvailability } from "../../../models/types";
import {
  Bed,
  Filter,
  Plus,
  Search,
  Trash,
  Edit,
  Eye,
  Users,
  DollarSign,
} from "lucide-react";

interface RoomAvailabilityStatus {
  isAvailable: boolean;
  price: number;
}

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

export default function RoomList() {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [filterType, setFilterType] = useState<number | null>(null);
  const [filterFloor, setFilterFloor] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [availabilities, setAvailabilities] = useState<
    Record<string, RoomAvailability[]>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedRoomTypes = JSON.parse(
          localStorage.getItem("roomTypes") || "[]"
        );
        setRoomTypes(storedRoomTypes);

        const allAvailabilities: Record<string, RoomAvailability[]> = {};
        const today = new Date();
        const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

        if (hotelId) {
          const storedHotels = JSON.parse(
            localStorage.getItem("hotels") || "[]"
          );
          const currentHotel = storedHotels.find(
            (h: Hotel) => h.id === Number(hotelId)
          );
          setHotel(currentHotel || null);

          const hotelRooms = JSON.parse(
            localStorage.getItem(`hotelRooms_${hotelId}`) || "[]"
          );
          setRooms(hotelRooms);

          hotelRooms.forEach((room: Room) => {
            const storageKey = `roomAvailability_${room.id}_${currentMonth}`;
            const storedAvailability = localStorage.getItem(storageKey);
            if (storedAvailability) {
              allAvailabilities[room.id] = JSON.parse(storedAvailability);
            }
          });
        } else {
          const storedHotels = JSON.parse(
            localStorage.getItem("hotels") || "[]"
          );
          let allRooms: Room[] = [];

          storedHotels.forEach((hotel: Hotel) => {
            const hotelRooms = JSON.parse(
              localStorage.getItem(`hotelRooms_${hotel.id}`) || "[]"
            );
            allRooms = [...allRooms, ...hotelRooms];

            hotelRooms.forEach((room: Room) => {
              const storageKey = `roomAvailability_${room.id}_${currentMonth}`;
              const storedAvailability = localStorage.getItem(storageKey);
              if (storedAvailability) {
                allAvailabilities[room.id] = JSON.parse(storedAvailability);
              }
            });
          });

          setRooms(allRooms);
        }

        setAvailabilities(allAvailabilities);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hotelId]);

  const getRoomType = (typeId: number) =>
    roomTypes.find((type) => type.id === typeId);

  const getRoomAvailability = (roomId: number): RoomAvailabilityStatus => {
    const today = new Date().toISOString().split("T")[0];
    const roomAvailabilities = availabilities[roomId];
    const room = rooms.find((r) => r.id === roomId);
    const roomType = room ? getRoomType(room.roomTypeId) : undefined;

    const defaultStatus: RoomAvailabilityStatus = {
      isAvailable: true,
      price: roomType?.basePrice || 0,
    };

    if (!roomAvailabilities) return defaultStatus;

    const todayAvailability = roomAvailabilities.find((a) => a.date === today);
    if (!todayAvailability) return defaultStatus;

    return {
      isAvailable: todayAvailability.isAvailable,
      price: todayAvailability.price ?? defaultStatus.price,
    };
  };

  const toggleRoomAvailability = (
    roomId: number,
    date: string,
    isAvailable: boolean
  ) => {
    const currentMonth = date.substring(0, 7);
    const storageKey = `roomAvailability_${roomId}_${currentMonth}`;

    const existingAvailabilities: RoomAvailability[] = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );

    const updatedAvailabilities = [...existingAvailabilities];
    const existingIndex = updatedAvailabilities.findIndex(
      (a) => a.date === date
    );

    const room = rooms.find((r) => r.id === roomId);
    const roomType = room ? getRoomType(room.roomTypeId) : undefined;

    if (existingIndex >= 0) {
      updatedAvailabilities[existingIndex] = {
        ...updatedAvailabilities[existingIndex],
        isAvailable,
        price: updatedAvailabilities[existingIndex].price,
      };
    } else {
      updatedAvailabilities.push({
          roomId,
          date,
          isAvailable,
          price: roomType?.basePrice || 0,
          id: 0
      });
    }

    localStorage.setItem(storageKey, JSON.stringify(updatedAvailabilities));
    setAvailabilities((prev) => ({
      ...prev,
      [roomId]: updatedAvailabilities,
    }));
  };

  const getUniqueFloors = () => {
    const floors = rooms.map((room) => room.floor);
    return [...new Set(floors)].sort((a, b) => Number(a) - Number(b));
  };

  const handleDelete = (roomId: number) => {
    if (window.confirm("Supprimer cette chambre ?")) {
      if (hotelId) {
        const updatedRooms = rooms.filter((room) => room.id !== roomId);
        localStorage.setItem(
          `hotelRooms_${hotelId}`,
          JSON.stringify(updatedRooms)
        );
        setRooms(updatedRooms);
      } else {
        const roomToDelete = rooms.find((room) => room.id === roomId);
        if (roomToDelete) {
          const hotelRooms = JSON.parse(
            localStorage.getItem(`hotelRooms_${roomToDelete.hotelId}`) || "[]"
          );
          const updatedRooms = hotelRooms.filter(
            (room: { id: number }) => room.id !== roomId
          );
          localStorage.setItem(
            `hotelRooms_${roomToDelete.hotelId}`,
            JSON.stringify(updatedRooms)
          );
          setRooms(rooms.filter((room) => room.id !== roomId));
        }
      }
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const textMatch = room.roomNumber
      .toString()
      .toLowerCase()
      .includes(filter.toLowerCase());
    const typeMatch = filterType === null || room.roomTypeId === filterType;
    const floorMatch = filterFloor === null || room.floor === filterFloor;
    return textMatch && typeMatch && floorMatch;
  });

  const getRandomRating = () => (8.5 + Math.random() * 1.5).toFixed(1);
  const getRandomReviews = () => Math.floor(50 + Math.random() * 350);

  if (loading) return <div className="text-center py-8">Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {hotel ? `Chambres - ${hotel.name}` : "Toutes les chambres"}
          </h1>
          <p className="text-gray-600">
            {filteredRooms.length} chambre(s) trouvée(s)
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded ${viewMode === "card" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <button
            onClick={() =>
              navigate(
                hotelId
                  ? `/admin/hotels/${hotelId}/rooms/create`
                  : "/admin/rooms/create"
              )
            }
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Ajouter une chambre
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Rechercher par numéro..."
              className="border-none focus:ring-0 focus:outline-none text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-gray-600 hover:text-blue-500"
          >
            <Filter size={18} className="mr-1" />
            <span>Filtres</span>
          </button>
        </div>

        {showFilters && (
          <div className="p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de chambre
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={filterType || ""}
                onChange={(e) =>
                  setFilterType(e.target.value ? Number(e.target.value) : null)
                }
              >
                <option value="">Tous les types</option>
                {roomTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.capacity} pers.)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Étage
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={filterFloor || ""}
                onChange={(e) =>
                  setFilterFloor(e.target.value ? Number(e.target.value) : null)
                }
              >
                <option value="">Tous les étages</option>
                {getUniqueFloors().map((floor) => (
                  <option key={floor} value={floor}>
                    Étage {floor}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilter("");
                  setFilterType(null);
                  setFilterFloor(null);
                }}
                className="text-blue-500 hover:text-blue-700 text-sm px-3 py-2"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}
      </div>

      {viewMode === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredRooms.map((room) => {
            const roomType = getRoomType(room.roomTypeId);
            const availability = getRoomAvailability(room.id);
            const rating = getRandomRating();
            const reviews = getRandomReviews();
            const ratingClass =
              parseFloat(rating) >= 9.5
                ? "bg-green-600"
                : parseFloat(rating) >= 9.0
                  ? "bg-green-500"
                  : parseFloat(rating) >= 8.5
                    ? "bg-blue-500"
                    : "bg-blue-400";

            return (
              <div
                key={room.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden border ${
                  availability.isAvailable
                    ? "border-gray-200"
                    : "border-red-200"
                } transition-transform hover:shadow-lg`}
              >
                <div className="relative">
                  <div
                    className="cursor-pointer"
                    onClick={() => navigate(`/admin/rooms/${room.id}/view`)}
                  >
                    {roomType?.images && roomType.images.length > 0 ? (
                      <img
                        src={roomType.images[0]}
                        alt={`Chambre ${room.roomNumber}`}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Aucune image</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <div
                        className={`${ratingClass} text-white font-bold px-2 py-1 rounded-lg text-sm`}
                      >
                        {rating}
                      </div>
                    </div>
                    {!availability.isAvailable && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm">
                        Indisponible
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className="text-lg font-semibold cursor-pointer hover:text-blue-600"
                      onClick={() => navigate(`/admin/rooms/${room.id}/view`)}
                    >
                      Chambre {room.roomNumber}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                      {parseFloat(rating) >= 9.0
                        ? "Exceptionnel"
                        : "Merveilleux"}{" "}
                      <span className="text-xs ml-1">({reviews} avis)</span>
                    </div>
                  </div>

                  {roomType && (
                    <>
                      <p className="text-gray-700 mb-2">{roomType.name}</p>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Users size={16} className="mr-1" />
                        <span>{roomType.capacity} personnes</span>
                        <span className="mx-2">•</span>
                        <span>Étage {room.floor}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {room.hasAirConditioning && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Climatisation
                          </span>
                        )}
                        {room.hasTv && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            TV
                          </span>
                        )}
                        {room.hasMinibar && (
                          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                            Minibar
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium">Disponibilité:</span>
                    <div className="flex items-center">
                      <ToggleSwitch
                        isOn={availability.isAvailable}
                        onToggle={() => {
                          const today = new Date().toISOString().split("T")[0];
                          toggleRoomAvailability(
                            room.id,
                            today,
                            !availability.isAvailable
                          );
                        }}
                      />
                      {/* <span className="ml-2 text-sm">
                        {availability.isAvailable
                          ? "Disponible"
                          : "Indisponible"}
                      </span> */}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    <div>
                      <div className="text-gray-500 text-sm">Prix par nuit</div>
                      <div className="text-xl font-bold text-blue-600">
                        {availability.price.toFixed(2)} €
                      </div>
                      <div className="text-xs text-gray-500">
                        taxes et frais compris
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => navigate(`/admin/rooms/${room.id}/view`)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Voir les détails"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/rooms/${room.id}/edit`)}
                        className="text-amber-600 hover:text-amber-900 p-1"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Supprimer"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === "list" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredRooms.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Numéro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Étage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Disponibilité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Équipements
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRooms.map((room) => {
                    const roomType = getRoomType(room.roomTypeId);
                    const availability = getRoomAvailability(room.id);

                    return (
                      <tr key={room.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Bed className="text-gray-500 mr-2" size={18} />
                            <span className="font-medium">
                              {room.roomNumber}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {roomType?.name || "Type inconnu"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          Étage {room.floor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {roomType?.capacity || 0} personnes
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <DollarSign size={16} className="inline mr-1" />
                          {availability.price.toFixed(2)} €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <ToggleSwitch
                              isOn={availability.isAvailable}
                              onToggle={() => {
                                const today = new Date()
                                  .toISOString()
                                  .split("T")[0];
                                toggleRoomAvailability(
                                  room.id,
                                  today,
                                  !availability.isAvailable
                                );
                              }}
                            />
                            {/* <span className="ml-2 text-sm">
                              {availability.isAvailable
                                ? "Disponible"
                                : "Indisponible"}
                            </span> */}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {room.hasAirConditioning && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                Climatisation
                              </span>
                            )}
                            {room.hasTv && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                TV
                              </span>
                            )}
                            {room.hasMinibar && (
                              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                                Minibar
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() =>
                                navigate(`/admin/rooms/${room.id}/view`)
                              }
                              className="text-blue-600 hover:text-blue-900"
                              title="Voir les détails"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/admin/rooms/${room.id}/edit`)
                              }
                              className="text-amber-600 hover:text-amber-900"
                              title="Modifier"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(room.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Supprimer"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 px-4 text-center text-gray-500">
              <Bed size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium mb-2">Aucune chambre trouvée</p>
              <p className="mb-6">
                {filter || filterType || filterFloor
                  ? "Aucune chambre ne correspond à vos critères de recherche."
                  : "Commencez par ajouter une chambre."}
              </p>
              <button
                onClick={() =>
                  navigate(
                    hotelId
                      ? `/admin/hotels/${hotelId}/rooms/create`
                      : "/admin/rooms/create"
                  )
                }
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Ajouter une chambre
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
