import React, { useState, useEffect } from "react";
import { X, Users, DollarSign, ArrowLeft } from "lucide-react";
import ImageGallery from "../../../components/ImageGallery";
import { RoomType } from "../../../models/types";
import { useNavigate, useParams } from "react-router-dom";

interface RoomTypeDetailsProps {
  roomType?: RoomType;
  onClose?: () => void;
  onEdit?: (id: number) => void;
}

const RoomTypeDetails: React.FC<RoomTypeDetailsProps> = ({
  roomType: propRoomType,
  onClose,
  onEdit,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [roomType, setRoomType] = useState<RoomType | null>(
    propRoomType || null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (propRoomType) {
      setRoomType(propRoomType);
    } else if (id) {
      // Charger les données depuis localStorage
      setIsLoading(true);
      try {
        const storedRoomTypes = JSON.parse(
          localStorage.getItem("roomTypes") || "[]"
        );
        const foundRoomType = storedRoomTypes.find(
          (rt: RoomType) => rt.id === parseInt(id)
        );

        if (foundRoomType) {
          setRoomType(foundRoomType);
        } else {
          console.error("Type de chambre non trouvé avec ID:", id);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du type de chambre", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, propRoomType]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/admin/room-types");
    }
  };

  const handleEdit = () => {
    if (roomType) {
      if (onEdit) {
        onEdit(roomType.id);
      } else {
        navigate(`/admin/room-types/edit/${roomType.id}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!roomType) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Type de chambre non trouvé</p>
        <button
          onClick={handleClose}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800 flex items-center"
          >
            <ArrowLeft size={20} className="mr-1" />
            Retour
          </button>
          <h1 className="text-2xl font-bold text-center flex-1">
            {roomType.name}
          </h1>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Galerie d'images principale */}
          {roomType.images && roomType.images.length > 0 ? (
            <div className="mb-6">
              <ImageGallery images={roomType.images} alt={roomType.name} />
            </div>
          ) : (
            <div className="mb-6 p-8 bg-gray-100 text-center text-gray-500 rounded-lg">
              Aucune image disponible
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {roomType.description || "Aucune description disponible"}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Commodités</h2>
                {roomType.amenities && roomType.amenities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {roomType.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucune commodité spécifiée</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Informations</h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{roomType.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Users size={16} className="mr-1" /> Capacité:
                    </span>
                    <span className="font-medium">
                      {roomType.capacity || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <DollarSign size={16} className="mr-1" /> Prix:
                    </span>
                    <span className="font-medium">
                      {roomType.basePrice
                        ? `${roomType.basePrice.toLocaleString()} €`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleEdit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                >
                  Modifier ce type
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomTypeDetails;
