import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Hotel, Room, RoomType, Booking } from "../../../models/types";
import {
  Users,
  Home,
  Calendar,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Bed,
  FileText,
  Coffee,
  List,
  Calendar as CalendarIcon,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    occupancyRate: 0,
    pendingBookings: 0,
    totalGuests: 0,
    revenueChange: 0, // Ajout d'une propriété pour stocker la variation
  });

  // Dates for comparison
  const currentDate = new Date();
  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
  const previousMonthStr = `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, "0")}`;

  useEffect(() => {
    const loadData = () => {
      try {
        // Load hotels
        const storedHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
        setHotels(storedHotels);

        // Load room types
        const storedRoomTypes = JSON.parse(
          localStorage.getItem("roomTypes") || "[]"
        );
        setRoomTypes(storedRoomTypes);

        // Load rooms (combining from all hotels)
        let allRooms: Room[] = [];
        storedHotels.forEach((hotel: Hotel) => {
          const hotelRooms = JSON.parse(
            localStorage.getItem(`hotelRooms_${hotel.id}`) || "[]"
          );
          allRooms = [...allRooms, ...hotelRooms];
        });
        setRooms(allRooms);

        // Load bookings
        const storedBookings = JSON.parse(
          localStorage.getItem("bookings") || "[]"
        );
        setBookings(storedBookings);

        // Calculate stats
        calculateStats(storedBookings, allRooms);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const calculateStats = (bookings: Booking[], allRooms: Room[]) => {
    // Calculate total current month revenue
    const currentMonthBookings = bookings.filter((booking) =>
      booking.checkInDate.startsWith(currentMonthStr)
    );

    const totalRevenue = currentMonthBookings.reduce(
      (sum, booking) => sum + (booking.totalAmount || 0),
      0
    );

    // Calculate previous month revenue for comparison
    const previousMonthBookings = bookings.filter((booking) =>
      booking.checkInDate.startsWith(previousMonthStr)
    );
    const previousRevenue = previousMonthBookings.reduce(
      (sum, booking) => sum + (booking.totalAmount || 0),
      0
    );

    // Calculate revenue change percentage
    const revenueChange =
      previousRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    // Calculate occupancy rate (simplified)
    const totalRooms = allRooms.length;
    const occupiedRoomIds = new Set(currentMonthBookings.map((b) => b.roomId));
    const occupancyRate =
      totalRooms > 0 ? (occupiedRoomIds.size / totalRooms) * 100 : 0;

    // Count pending bookings
    const pendingBookings = bookings.filter(
      (b) => b.status === "pending"
    ).length;

    // Count total guests for current month
    const totalGuests = currentMonthBookings.reduce(
      (sum, booking) => sum + (booking.guestCount || 1),
      0
    );

    setStats({
      totalRevenue,
      occupancyRate,
      pendingBookings,
      totalGuests,
      revenueChange,
    });
  };

  const getPopularRooms = () => {
    // Create a map to count bookings per room
    const roomBookingCounts = new Map<number, number>();
    bookings.forEach((booking) => {
      const count = roomBookingCounts.get(booking.roomId) || 0;
      roomBookingCounts.set(booking.roomId, count + 1);
    });

    // Convert to array and sort by count
    const roomCounts = Array.from(roomBookingCounts.entries())
      .map(([roomId, count]) => ({ roomId, count }))
      .sort((a, b) => b.count - a.count);

    // Get top 5 room details
    const topRooms = roomCounts.slice(0, 5).map((item) => {
      const room = rooms.find((r) => r.id === item.roomId);
      const hotel = hotels.find((h) => h.id === room?.hotelId);
      const roomType = roomTypes.find((rt) => rt.id === room?.roomTypeId);

      // Supposons que roomType.images est un tableau de chaînes ou un tableau d'objets avec imageUrl
      let imageUrl = null;
      if (roomType?.images && roomType.images.length > 0) {
        // Vérifie si le premier élément est un objet avec imageUrl
        if (
          typeof roomType.images[0] === "object" &&
          roomType.images[0] !== null
        ) {
          type RoomImage = {
            imageUrl: string;
          };

          imageUrl = (roomType.images[0] as RoomImage).imageUrl || null;
        } else {
          // Si c'est une chaîne, utiliser directement
          imageUrl = roomType.images[0] as string;
        }
      }

      return {
        id: room?.id || 0,
        roomNumber: room?.roomNumber || "",
        hotelName: hotel?.name || "Unknown Hotel",
        typeName: roomType?.name || "Unknown Type",
        bookingCount: item.count,
        image: imageUrl,
      };
    });

    return topRooms;
  };

  const getRecentBookings = () => {
    return bookings
      .sort(
        (a, b) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
      )
      .slice(0, 5)
      .map((booking) => {
        const room = rooms.find((r) => r.id === booking.roomId);
        const hotel = hotels.find((h) => h.id === room?.hotelId);
        return {
          ...booking,
          roomNumber: room?.roomNumber || "",
          hotelName: hotel?.name || "Unknown Hotel",
          // On ajoute cette propriété si elle n'existe pas dans le type Booking
          guestName:
            booking.guestName || booking.userId
              ? `Client #${booking.userId}`
              : "Client inconnu",
        };
      });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  const popularRooms = getPopularRooms();
  const recentBookings = getRecentBookings();

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tableau de Bord</h1>
        <p className="text-gray-600">
          Bienvenue sur le tableau de bord de votre système de gestion hôtelière
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Revenus (ce mois)</p>
              <h2 className="text-2xl font-bold">
                {stats.totalRevenue.toFixed(2)} €
              </h2>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span
              className={`flex items-center ${stats.revenueChange >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {stats.revenueChange >= 0 ? (
                <ArrowUpRight size={16} className="mr-1" />
              ) : (
                <ArrowDownRight size={16} className="mr-1" />
              )}
              <span>{stats.revenueChange.toFixed(1)}%</span>
            </span>
            <span className="text-gray-500 ml-2">vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Taux d'occupation</p>
              <h2 className="text-2xl font-bold">
                {stats.occupancyRate.toFixed(1)}%
              </h2>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="flex items-center text-green-500">
              <ArrowUpRight size={16} className="mr-1" />
              <span>+5.2%</span>
            </span>
            <span className="text-gray-500 ml-2">vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Réservations en attente</p>
              <h2 className="text-2xl font-bold">{stats.pendingBookings}</h2>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Calendar size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="flex items-center text-red-500">
              <ArrowDownRight size={16} className="mr-1" />
              <span>-2.3%</span>
            </span>
            <span className="text-gray-500 ml-2">vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Total clients</p>
              <h2 className="text-2xl font-bold">{stats.totalGuests}</h2>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Users size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="flex items-center text-green-500">
              <ArrowUpRight size={16} className="mr-1" />
              <span>+8.1%</span>
            </span>
            <span className="text-gray-500 ml-2">vs mois dernier</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow mb-8 overflow-hidden">
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <h2 className="text-lg font-semibold">Actions Rapides</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 divide-x divide-y md:divide-y-0">
          <button
            onClick={() => navigate("/admin/hotels/create")}
            className="p-6 flex flex-col items-center justify-center hover:bg-gray-50"
          >
            <Home size={24} className="text-blue-600 mb-2" />
            <span className="text-sm font-medium">Ajouter un hôtel</span>
          </button>
          <button
            onClick={() => navigate("/admin/room-types/create")}
            className="p-6 flex flex-col items-center justify-center hover:bg-gray-50"
          >
            <Bed size={24} className="text-green-600 mb-2" />
            <span className="text-sm font-medium">
              Créer un type de chambre
            </span>
          </button>
          <button
            onClick={() => navigate("/admin/rooms")}
            className="p-6 flex flex-col items-center justify-center hover:bg-gray-50"
          >
            <List size={24} className="text-indigo-600 mb-2" />
            <span className="text-sm font-medium">Liste des chambres</span>
          </button>
          <button
            onClick={() => navigate("/admin/rooms/availability")}
            className="p-6 flex flex-col items-center justify-center hover:bg-gray-50"
          >
            <CalendarIcon size={24} className="text-amber-600 mb-2" />
            <span className="text-sm font-medium">Disponibilités</span>
          </button>
          <button
            onClick={() => navigate("/admin/bookings/create")}
            className="p-6 flex flex-col items-center justify-center hover:bg-gray-50"
          >
            <Calendar size={24} className="text-purple-600 mb-2" />
            <span className="text-sm font-medium">Nouvelle réservation</span>
          </button>
          <button
            onClick={() => navigate("/admin/reports")}
            className="p-6 flex flex-col items-center justify-center hover:bg-gray-50"
          >
            <FileText size={24} className="text-red-600 mb-2" />
            <span className="text-sm font-medium">Générer un rapport</span>
          </button>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Rooms */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Chambres Populaires</h2>
            <button
              onClick={() => navigate("/admin/rooms")}
              className="text-blue-600 text-sm hover:underline"
            >
              Voir tout
            </button>
          </div>
          <div className="divide-y">
            {popularRooms.map((room) => (
              <div key={room.id} className="p-4 flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden mr-4 flex-shrink-0">
                  {room.image ? (
                    <img
                      src={room.image}
                      alt={`Chambre ${room.roomNumber}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Bed size={24} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">
                    {room.typeName} - {room.roomNumber}
                  </h3>
                  <p className="text-sm text-gray-600">{room.hotelName}</p>
                </div>
                <div className="flex items-center text-sm">
                  <Coffee className="text-amber-500 mr-1" size={16} />
                  <span>{room.bookingCount} réservations</span>
                </div>
              </div>
            ))}

            {popularRooms.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                Aucune donnée de réservation disponible
              </div>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Réservations Récentes</h2>
            <button
              onClick={() => navigate("/admin/bookings")}
              className="text-blue-600 text-sm hover:underline"
            >
              Voir tout
            </button>
          </div>
          <div className="divide-y">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{booking.guestName}</h3>
                    <p className="text-sm text-gray-600">
                      {booking.hotelName} - Chambre {booking.roomNumber}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {booking.status === "confirmed"
                        ? "Confirmée"
                        : booking.status === "pending"
                          ? "En attente"
                          : booking.status === "cancelled"
                            ? "Annulée"
                            : booking.status}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-600">
                    {new Date(booking.checkInDate).toLocaleDateString("fr-FR")}{" "}
                    -{" "}
                    {new Date(booking.checkOutDate).toLocaleDateString("fr-FR")}
                  </span>
                  <span className="font-medium">
                    {booking.totalAmount?.toFixed(2) || 0} €
                  </span>
                </div>
              </div>
            ))}

            {recentBookings.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                Aucune réservation récente
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hotel Summary */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Résumé des Hôtels</h2>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hôtel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adresse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chambres
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taux d'occupation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hotels.map((hotel) => {
                  // Get rooms for this hotel
                  const hotelRooms = rooms.filter(
                    (r) => r.hotelId === hotel.id
                  );
                  const roomCount = hotelRooms.length;

                  // Calculate occupancy
                  const occupiedRoomIds = new Set(
                    bookings
                      .filter(
                        (b) =>
                          b.status === "confirmed" &&
                          hotelRooms.some((r) => r.id === b.roomId)
                      )
                      .map((b) => b.roomId)
                  );

                  const occupancyRate =
                    roomCount > 0
                      ? (occupiedRoomIds.size / roomCount) * 100
                      : 0;

                  return (
                    <tr key={hotel.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">
                              {hotel.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {hotel.city}, {hotel.country}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {hotel.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() =>
                            navigate(`/admin/hotels/${hotel.id}/rooms`)
                          }
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {roomCount} chambres
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${occupancyRate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {occupancyRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/hotels/view/${hotel.id}`)
                            }
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Détails
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/hotels/${hotel.id}/availability`)
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            Disponibilités
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {hotels.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Aucun hôtel disponible
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
