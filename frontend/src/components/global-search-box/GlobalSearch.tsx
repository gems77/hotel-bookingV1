import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const GlobalSearch: React.FC = () => {
  const [city, setCity] = useState<string>('Pune');
  const [checkInDate, setCheckInDate] = useState<Date | null>(new Date());
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(new Date(Date.now() + 86400000)); // +1 day
  const [guests, setGuests] = useState<number>(1);

  const handleSearch = () => {
    console.log({ city, checkInDate, checkOutDate, guests });
    // Implémentez votre logique de recherche ici
  };

  return (
    <section className="bg-blue-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Titre et sous-titre */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Découvrez votre séjour idéal dans le monde entier </h1>
          <p className="text-xl text-gray-600">
          Entrez vos dates pour voir les derniers prix et commencez votre voyage de détente et d'aventure dès aujourd'hui.
          </p>
        </div>

        {/* Formulaire de recherche */}
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            {/* Ville */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Villes
              </label>
              <select
                id="city"
                className="w-full p-3 border border-blue-800 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="Pune">Cotonou</option>
                <option value="Mumbai">Porto-Novo</option>
                <option value="Delhi">Parakou</option>
                <option value="Bangalore">Natitingou</option>
              </select>
            </div>

            {/* Check-in */}
            <div>
              <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Check-in
              </label>
              <DatePicker
                selected={checkInDate}
                onChange={(date) => setCheckInDate(date)}
                selectsStart
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={new Date()}
                className="w-full p-3 border border-blue-800 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                id="check-in"
              />
            </div>

            {/* Check-out */}
            <div>
              <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Check-out
              </label>
              <DatePicker
                selected={checkOutDate}
                onChange={(date) => setCheckOutDate(date)}
                selectsEnd
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={checkInDate || new Date()}
                className="w-full p-3 border border-blue-800 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                id="check-out"
              />
            </div>

            {/* Nombre de voyageurs */}
            <div>
              <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                No d'invités
              </label>
              <select
                id="guests"
                className="w-full p-3 border border-blue-800 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Invités' : 'Invités'}
                  </option>
                ))}
              </select>
            </div>

            {/* Bouton de recherche */}
            <div>
              <button
                onClick={handleSearch}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
              >
                RECHERCHER
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalSearch;