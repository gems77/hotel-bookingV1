import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Hotel } from "../../../models/types";
import {
  ArrowLeft,
  ArrowRight,
  X,
  Wifi,
  Utensils,
  ParkingCircle,
  Dumbbell,
  WavesLadder,
  Image as ImageIcon,
  Images,
} from "lucide-react";

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    try {
      const hotels = JSON.parse(localStorage.getItem("hotels") || "[]");
      const foundHotel = hotels.find((h: Hotel) => h.id === Number(id));

      if (!foundHotel) {
        navigate("/admin/hotels");
        return;
      }

      setHotel({
        ...foundHotel,
        images: foundHotel.images || [],
      });
    } catch (error) {
      console.error("Erreur lors du chargement de l'hôtel:", error);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const primaryImage =
    hotel?.images && hotel.images.length > 0
      ? hotel.images.find((img) => img.isPrimary)?.imageUrl ||
        hotel.images[0].imageUrl
      : null;

  const changeImage = useCallback(
    (direction: "next" | "prev") => {
      if (!hotel?.images || hotel.images.length === 0) return;

      const images = hotel.images!;
      setCurrentImageIndex((prevIndex) =>
        direction === "next"
          ? (prevIndex + 1) % images.length
          : (prevIndex - 1 + images.length) % images.length
      );
    },
    [hotel]
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-xl text-center">
        Chargement...
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Erreur:</strong> Impossible de trouver cet hôtel.
        </div>
        <button
          onClick={() => navigate("/admin/hotels")}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Retourner à la liste
        </button>
      </div>
    );
  }

  // Extraction sûre des images après avoir confirmé que hotel existe
  const hotelImages = hotel.images || [];
  const hasMultipleImages = hotelImages.length > 1;

  return (
    <div className="container mx-auto px-60 py-8">
      {showImageGallery && hotelImages.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col justify-center items-center">
          <button
            onClick={() => setShowImageGallery(false)}
            className="absolute top-4 right-4 text-white"
          >
            <X size={32} />
          </button>
          <div className="relative w-full h-4/5 flex justify-center items-center">
            {hotelImages[currentImageIndex] && (
              <img
                src={hotelImages[currentImageIndex].imageUrl}
                alt={`Image ${currentImageIndex + 1} de ${hotel.name}`}
                className="max-h-full max-w-full object-contain"
              />
            )}
            {hasMultipleImages && (
              <>
                <button
                  onClick={() => changeImage("prev")}
                  className="absolute left-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                >
                  <ArrowLeft size={24} />
                </button>
                <button
                  onClick={() => changeImage("next")}
                  className="absolute right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                >
                  <ArrowRight size={24} />
                </button>
              </>
            )}
          </div>
          <div className="mt-4 text-white">
            {currentImageIndex + 1} / {hotelImages.length}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
        <div className="space-x-2">
          <Link
            to={`/admin/hotels/${hotel.id}/images`}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Gérer les images
          </Link>
          <Link
            to={`/admin/hotels/edit/${hotel.id}`}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
          >
            Modifier
          </Link>
          <button
            onClick={() => navigate("/admin/hotels")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
          >
            Retour
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative h-80 bg-gray-200">
          {primaryImage ? (
            <>
              <img
                src={primaryImage}
                alt={`Image principale de ${hotel.name}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setShowImageGallery(true)}
              />
              {/* Indicateur de galerie d'images */}
              {hasMultipleImages && (
                <div
                  className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white p-2 rounded-lg cursor-pointer flex items-center"
                  onClick={() => setShowImageGallery(true)}
                >
                  <Images size={20} />
                  <span className="ml-1 text-sm">
                    {hotelImages.length} photos
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={64} className="text-gray-400" />
              <p className="ml-2 text-gray-500">Aucune image disponible</p>
            </div>
          )}
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
          <p>
            <strong>Adresse :</strong> {hotel.address}
          </p>
          <p>
            <strong>Ville :</strong> {hotel.city}
          </p>
          <p>
            <strong>Pays :</strong> {hotel.country}
          </p>
          {hotel.starRating && (
            <p>
              <strong>Classification :</strong> {hotel.starRating} étoile(s)
            </p>
          )}

          <h2 className="text-xl font-semibold my-4">Équipements</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                label: "WiFi",
                available: hotel.hasWifi,
                icon: <Wifi size={18} />,
              },
              {
                label: "Piscine",
                available: hotel.hasPool,
                icon: <WavesLadder size={18} />,
              },
              {
                label: "Restaurant",
                available: hotel.hasRestaurant,
                icon: <Utensils size={18} />,
              },
              {
                label: "Parking",
                available: hotel.hasParking,
                icon: <ParkingCircle size={18} />,
              },
              {
                label: "Salle de sport",
                available: hotel.hasGym,
                icon: <Dumbbell size={18} />,
              },
            ].map(({ label, available, icon }) => (
              <div
                key={label}
                className={`flex items-center ${available ? "text-green-600" : "text-gray-400"}`}
              >
                {icon} <span className="ml-1">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
