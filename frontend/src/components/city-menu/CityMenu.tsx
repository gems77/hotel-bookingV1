import React from 'react';
import { Link } from 'react-router-dom';

interface DestinationCardProps {
  city: string;
  imageUrl: string;
  hotelCount: number;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ city, imageUrl, hotelCount }) => {
  return (
    <Link 
      to={`/hotels/${city.toLowerCase()}`} 
      className="group relative block overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <img 
        src={imageUrl} 
        alt={city} 
        className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-2xl font-bold">{city}</h3>
          <p className="text-sm">{hotelCount}+ hotels available</p>
        </div>
      </div>
    </Link>
  );
};

const CityMenu: React.FC = () => {
  const destinations = [
    { 
      city: 'Mumbai', 
      imageUrl: 'https://source.unsplash.com/random/600x400/?mumbai',
      hotelCount: 124
    },
    { 
      city: 'Bangkok', 
      imageUrl: 'https://source.unsplash.com/random/600x400/?bangkok',
      hotelCount: 89
    },
    { 
      city: 'London', 
      imageUrl: 'https://source.unsplash.com/random/600x400/?london',
      hotelCount: 156
    },
    { 
      city: 'Dubai', 
      imageUrl: 'https://source.unsplash.com/random/600x400/?dubai',
      hotelCount: 112
    },
    { 
      city: 'Oslo', 
      imageUrl: 'https://source.unsplash.com/random/600x400/?oslo',
      hotelCount: 67
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Titre principal */}
        <h2 className="text-3xl font-bold text-center mb-8">Book Hotels at Popular Destinations</h2>
        
        {/* Grille des destinations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {destinations.map((destination) => (
            <DestinationCard 
              key={destination.city}
              city={destination.city}
              imageUrl={destination.imageUrl}
              hotelCount={destination.hotelCount}
            />
          ))}
        </div>

        {/* Section "Handpicked nearby hotels" */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Handpicked nearby hotels for you</h3>
          {/* Ici vous pourriez ajouter une autre grille d'hôtels spécifiques */}
        </div>
      </div>
    </section>
  );
};

export default CityMenu;