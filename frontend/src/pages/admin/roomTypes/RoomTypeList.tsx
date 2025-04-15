import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Eye, Bed, Users, DollarSign } from "lucide-react";
import ImageGallery from "../../../components/ImageGallery";
import { RoomType } from "../../../models/types";
import { useNavigate } from "react-router-dom";

interface RoomTypeListProps {
  roomTypes?: RoomType[];
  onDelete?: (id: number) => void;
}

const RoomTypeList: React.FC<RoomTypeListProps> = ({
  roomTypes: propRoomTypes,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  // Si les types de chambres sont fournis via les props, utilisez-les
  // Sinon, vous pourriez les charger depuis une API
  useEffect(() => {
    if (propRoomTypes) {
      setRoomTypes(propRoomTypes);
    } else {
      // Charger depuis localStorage
      const storedRoomTypes = JSON.parse(
        localStorage.getItem("roomTypes") || "[]"
      );
      setRoomTypes(storedRoomTypes);
    }
  }, [propRoomTypes]);

  const handleAdd = () => {
    navigate("/admin/room-types/create");
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/room-types/edit/${id}`);
  };

  const handleView = (id: number) => {
    navigate(`/admin/room-types/view/${id}`);
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer ce type de chambre ?")
    ) {
      if (onDelete) {
        onDelete(id);
      } else {
        // Supprimer de localStorage
        const updatedRoomTypes = roomTypes.filter(
          (roomType) => roomType.id !== id
        );
        setRoomTypes(updatedRoomTypes);
        localStorage.setItem("roomTypes", JSON.stringify(updatedRoomTypes));
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Types de Chambres</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Ajouter un type
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roomTypes.map((roomType) => (
          <div
            key={roomType.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-transform hover:scale-[1.02]"
          >
            {/* Galerie d'images */}
            <div
              className="cursor-pointer"
              onClick={() => handleView(roomType.id)}
            >
              <ImageGallery
                images={roomType.images || []}
                alt={roomType.name}
              />
            </div>

            <div className="p-4">
              <h2
                className="text-xl font-semibold mb-2 cursor-pointer"
                onClick={() => handleView(roomType.id)}
              >
                {roomType.name}
              </h2>

              <div className="flex items-center text-gray-600 mb-2">
                <Bed size={18} className="mr-1" />
                <span className="mr-4">Type: {roomType.name}</span>
                <Users size={18} className="mr-1" />
                <span>Max: {roomType.capacity} pers.</span>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <DollarSign size={18} className="mr-1" />
                <span className="font-semibold text-lg">
                  {roomType.basePrice?.toFixed(2) || "0.00"} €
                </span>
                <span className="text-sm text-gray-500 ml-1">/ nuit</span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {roomType.description}
              </p>

              {/* Affichage des commodités si disponibles */}
              {roomType.amenities && roomType.amenities.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-1">Commodités:</h3>
                  <div className="flex flex-wrap gap-1">
                    {roomType.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {roomType.amenities.length > 3 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        +{roomType.amenities.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => handleView(roomType.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  title="Voir les détails"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => handleEdit(roomType.id)}
                  className="p-2 text-amber-600 hover:bg-amber-50 rounded-full"
                  title="Modifier"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(roomType.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {roomTypes.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun type de chambre disponible</p>
          <button
            onClick={handleAdd}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Ajouter un type de chambre
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomTypeList;
