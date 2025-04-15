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

const PopularDestinations: React.FC = () => {
  const destinations = [
    { 
      city: 'Cotonou', 
      imageUrl: 'https://s3.amazonaws.com/static-webstudio-accorhotels-usa-1.wp-ha.fastbooking.com/wp-content/uploads/sites/19/2022/03/09202519/DUF_8665-v-ok-1170x780.jpg',
      hotelCount: 124
    },
    { 
      city: 'Porto-Novo', 
      imageUrl: 'https://imgs.search.brave.com/rnM0KrEPestZmK5XZu8anEcZZ9T-C3boJyLhOQq7Mz4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvODQ0/MjUxMzIvcGhvdG8v/YnVyai1hbC1hcmFi/LWhvdGVsLWR1YmFp/LXVhZS5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9bGZ2MFNt/RHFvaDE5OU1wcGFS/MHVGT19rNkhjaGQ4/QmpNd29MZUtiM0FW/Zz0',
      hotelCount: 89
    },
    { 
      city: 'Parakou', 
      imageUrl: 'https://imgs.search.brave.com/glX7-2l-ZU2dGXZR7_bWZUm6zmRnrHuCffxy38thilQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM4/MDg3MzQzL3Bob3Rv/L2R1YmFpLW1hZGlu/YXQtanVtZWlyYWgt/YW5kLXRoZS1idXJq/LWFsLWFyYWItaG90/ZWwuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPV9VSTZ6bWZC/UHV0NWZiSVU3OHRo/dVN5OWJMSjJwbW1w/SHFUY3ptTGZLSDg9',
      hotelCount: 156
    },
    { 
      city: 'Natitingou', 
      imageUrl: 'https://media.gettyimages.com/id/154197651/photo/uae-toursim-armani-hotel.jpg?s=2048x2048&w=gi&k=20&c=icR0lXaERMEvglRssBvb-oohJ8G1dU5VK6nuD6mYZ9M=',
      hotelCount: 112
    },
    { 
      city: 'Oslo', 
      imageUrl: 'https://imgs.search.brave.com/_DVHL-wEiupEJV2ZDQXdhVO8IMpuXpg-eOz9WWZ1XfY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI5/MjQ2ODIxNS9waG90/by9ob3RlbC1hdGxh/bnRpcy1kdWJhaS1i/eS1uaWdodC5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9cEFR/Y3E1bE5sb2stekJC/X3dDV3kzOFlNSXkz/TVpnSkFMZnF6Q1Nq/bGFZcz0',
      hotelCount: 67
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Titre principal */}
        <h2 className="text-3xl font-bold text-center mb-8">Réserver des hôtels dans des destinations populaires</h2>
        
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
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Hôtels à proximité triés sur le volet</h3>
          {/* Ici vous pourriez ajouter une autre grille d'hôtels spécifiques */}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;