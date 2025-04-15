import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Hotel } from "../../../models/types";
import {
  Edit,
  Trash2,
  Plus,
  Eye,
  Star,
  Wifi,
  Utensils,
  ParkingCircle,
  Dumbbell,
  WavesLadder,
  Image as ImageIcon,
} from "lucide-react";

export default function HotelList() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer les hôtels depuis localStorage
    const loadHotels = () => {
      try {
        const storedHotels = localStorage.getItem("hotels");
        if (storedHotels) {
          setHotels(JSON.parse(storedHotels));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des hôtels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHotels();
  }, []);

  const handleDeleteHotel = (hotelId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet hôtel ?")) {
      try {
        // Filtrer les hôtels pour exclure celui qu'on veut supprimer
        const updatedHotels = hotels.filter((hotel) => hotel.id !== hotelId);

        // Sauvegarder la liste mise à jour dans localStorage
        localStorage.setItem("hotels", JSON.stringify(updatedHotels));

        // Mettre à jour l'état local
        setHotels(updatedHotels);

        // Facultatif: supprimer également les chambres et images associées à cet hôtel
        localStorage.removeItem(`hotelRooms_${hotelId}`);
        localStorage.removeItem(`hotelImages_${hotelId}`);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'hôtel:", error);
      }
    }
  };

  const renderHotelAmenities = (hotel: Hotel) => {
    return (
      <div className="flex space-x-2 text-gray-500">
        {hotel.hasWifi && <Wifi size={16} />}
        {hotel.hasPool && <WavesLadder size={16} />}
        {hotel.hasRestaurant && <Utensils size={16} />}
        {hotel.hasParking && <ParkingCircle size={16} />}
        {hotel.hasGym && <Dumbbell size={16} />}
      </div>
    );
  };

  const renderStarRating = (rating?: number) => {
    // Respecter le fait que starRating est optionnel dans l'interface
    const safeRating = rating || 0;
    return (
      <div className="flex items-center">
        {Array.from({ length: safeRating }).map((_, i) => (
          <Star key={i} size={16} className="text-yellow-400 fill-current" />
        ))}
      </div>
    );
  };

  // Récupérer l'image principale d'un hôtel
  const getPrimaryImage = (hotel: Hotel) => {
    if (hotel.images && hotel.images.length > 0) {
      const primaryImage = hotel.images.find((img) => img.isPrimary);
      return primaryImage ? primaryImage.imageUrl : hotel.images[0].imageUrl;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Chargement des hôtels...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Hôtels</h1>
        <button
          onClick={() => navigate("/admin/hotels/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Ajouter un hôtel
        </button>
      </div>

      {hotels.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Aucun hôtel n'a été ajouté.</p>
          <button
            onClick={() => navigate("/admin/hotels/create")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Créer votre premier hôtel
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              {/* Section d'image */}
              <div className="h-48 bg-gray-200 relative">
                {(() => {
                  const imageUrl = getPrimaryImage(hotel);
                  return imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <ImageIcon size={48} className="text-gray-400" />
                      <span className="ml-2 text-gray-500">Aucune image</span>
                    </div>
                  );
                })()}
                <div className="absolute bottom-2 right-2 bg-white bg-opacity-70 rounded px-2 py-1 text-sm">
                  {hotel.images?.length || 0} photos
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">{hotel.name}</h2>
                    <p className="text-gray-600 text-sm mb-2">
                      {hotel.city}, {hotel.country}
                    </p>
                    {renderStarRating(hotel.starRating)}
                  </div>
                  <div className="flex space-x-1">
                    <Link
                      to={`/admin/hotels/view/${hotel.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Voir les détails"
                    >
                      <Eye size={18} />
                    </Link>
                    <Link
                      to={`/admin/hotels/edit/${hotel.id}`}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
                      title="Modifier"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDeleteHotel(hotel.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 my-3 line-clamp-2">
                  {hotel.description || "Aucune description disponible."}
                </p>

                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-1">{hotel.address}</p>
                  {renderHotelAmenities(hotel)}
                </div>
              </div>

              <div className="border-t px-5 py-3 bg-gray-50 flex justify-between">
                <Link
                  to={`/admin/hotels/${hotel.id}/rooms`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                >
                  <Eye size={16} className="mr-1" />
                  Gérer les chambres
                </Link>
                <Link
                  to={`/admin/hotels/${hotel.id}/images`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                >
                  <ImageIcon size={16} className="mr-1" />
                  Gérer les images
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
