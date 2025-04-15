import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Hotel } from "../../../models/types";

export default function CreateEditHotel() {
  const navigate = useNavigate();
  const { id } = useParams(); // Récupérer l'ID de l'URL si présent
  const isEditMode = Boolean(id);

  const [hotel, setHotel] = useState<Partial<Hotel>>({
    name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    starRating: 3,
    hasWifi: false,
    hasPool: false,
    hasRestaurant: false,
    hasParking: false,
    hasGym: false,
  });

  // Charger les données de l'hôtel existant si on est en mode édition
  useEffect(() => {
    if (isEditMode && id) {
      const existingHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
      const hotelToEdit = existingHotels.find(
        (h: Hotel) => h.id === parseInt(id, 10)
      );

      if (hotelToEdit) {
        setHotel(hotelToEdit);
      } else {
        // Rediriger si l'hôtel n'existe pas
        navigate("/admin/hotels");
      }
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    if (name === "starRating") {
      setHotel({
        ...hotel,
        [name]: value ? parseInt(value, 10) : undefined,
      });
    } else {
      setHotel({
        ...hotel,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Obtenir les hôtels existants depuis localStorage
    const existingHotels = JSON.parse(localStorage.getItem("hotels") || "[]");

    if (isEditMode) {
      // Mise à jour d'un hôtel existant
      const updatedHotel: Hotel = {
        ...(hotel as Hotel),
        updatedAt: new Date().toISOString(),
      };

      const updatedHotels = existingHotels.map((h: Hotel) =>
        h.id === updatedHotel.id ? updatedHotel : h
      );

      localStorage.setItem("hotels", JSON.stringify(updatedHotels));
      console.log("Hotel updated:", updatedHotel);
    } else {
      // Création d'un nouvel hôtel
      const newHotel: Hotel = {
        id: Date.now(),
        name: hotel.name || "",
        address: hotel.address || "",
        city: hotel.city || "",
        country: hotel.country || "",
        hasWifi: hotel.hasWifi || false,
        hasPool: hotel.hasPool || false,
        hasRestaurant: hotel.hasRestaurant || false,
        hasParking: hotel.hasParking || false,
        hasGym: hotel.hasGym || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: hotel.description,
        starRating: hotel.starRating,
      };

      const updatedHotels = [...existingHotels, newHotel];
      localStorage.setItem("hotels", JSON.stringify(updatedHotels));
      console.log("Hotel created:", newHotel);
    }

    // Naviguer vers la liste des hôtels
    navigate("/admin/hotels");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Modifier l'hôtel" : "Créer un nouvel hôtel"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Nom de l'hôtel *
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            name="name"
            type="text"
            value={hotel.name || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            value={hotel.description || ""}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="address"
          >
            Adresse *
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address"
            name="address"
            type="text"
            value={hotel.address || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="city"
            >
              Ville *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="city"
              name="city"
              type="text"
              value={hotel.city || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="country"
            >
              Pays *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="country"
              name="country"
              type="text"
              value={hotel.country || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="starRating"
          >
            Étoiles
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="starRating"
            name="starRating"
            value={hotel.starRating?.toString() || ""}
            onChange={handleChange}
          >
            <option value="1">1 étoile</option>
            <option value="2">2 étoiles</option>
            <option value="3">3 étoiles</option>
            <option value="4">4 étoiles</option>
            <option value="5">5 étoiles</option>
          </select>
        </div>

        <div className="mb-6">
          <span className="block text-gray-700 text-sm font-bold mb-2">
            Équipements
          </span>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="hasWifi"
                  checked={hotel.hasWifi || false}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">WiFi</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="hasPool"
                  checked={hotel.hasPool || false}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Piscine</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="hasRestaurant"
                  checked={hotel.hasRestaurant || false}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Restaurant</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="hasParking"
                  checked={hotel.hasParking || false}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Parking</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="hasGym"
                  checked={hotel.hasGym || false}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Gym</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {isEditMode ? "Mettre à jour" : "Créer l'hôtel"}
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => navigate("/admin/hotels")}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
