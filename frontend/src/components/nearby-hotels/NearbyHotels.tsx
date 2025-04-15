import React from 'react';
import { Link } from 'react-router-dom';

interface Hotel {
  id: string;
  name: string;
  location: string;
  distance: string;
  features: string[];
  price: string;
  rating: number;
  reviewCount: number;
  image: string;
}

const NearbyHotels: React.FC = () => {
  const hotels: Hotel[] = [
    {
      id: '1',
      name: 'Cotonou',
      location: 'Sofitel, Cotonou',
      distance: '1 Km du centre ville',
      features: [
        'Annulation gratuite',
        'Pas de prépaiement nécessaire - paiement à la propriété'
      ],
      price: '150.000F',
      rating: 5,
      reviewCount: 18900,
      image: 'https://s3.amazonaws.com/static-webstudio-accorhotels-usa-1.wp-ha.fastbooking.com/wp-content/uploads/sites/19/2022/03/09202519/DUF_8665-v-ok-1170x780.jpg'
    },
    {
      id: '2',
      name: 'Hotel Béhanzin, Porto-Novo',
      location: "500 mètre du l'Assemblée nationale",
      features: [
        'Annulation gratuite',
        'Pas de prépaiement nécessaire - paiement à la propriété',
        'WIFI gratuit',
        'Dîner gratuit'
      ],
      distance: '5Km du centre ville',
      price: '85.000F',
      rating: 5,
      reviewCount: 25300,
      image: 'https://imgs.search.brave.com/rnM0KrEPestZmK5XZu8anEcZZ9T-C3boJyLhOQq7Mz4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvODQ0/MjUxMzIvcGhvdG8v/YnVyai1hbC1hcmFi/LWhvdGVsLWR1YmFp/LXVhZS5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9bGZ2MFNt/RHFvaDE5OU1wcGFS/MHVGT19rNkhjaGQ4/QmpNd29MZUtiM0FW/Zz0'
    },
    {
      id: '3',
      name: 'Kobourou City HotelWIFI, Parakou',
      location: 'Kobourou City Hotel, Parakou',
      distance: '105Km du centre ville',
      features: [
        'Annulation gratuite',
        'Pas de prépaiement nécessaire - paiement à la propriété',
        'WIFI gratuit '
      ],
      price: '55.000F',
      rating: 5,
      reviewCount: 11300,
      image: 'https://imgs.search.brave.com/glX7-2l-ZU2dGXZR7_bWZUm6zmRnrHuCffxy38thilQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM4/MDg3MzQzL3Bob3Rv/L2R1YmFpLW1hZGlu/YXQtanVtZWlyYWgt/YW5kLXRoZS1idXJq/LWFsLWFyYWItaG90/ZWwuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPV9VSTZ6bWZC/UHV0NWZiSVU3OHRo/dVN5OWJMSjJwbW1w/SHFUY3ptTGZLSDg9',
    }
  ];

  return (
    <section className="py-8 px-2 max-w-4xl mx-auto">
      
      <div className="space-y-6">
        {hotels.map((hotel) => (
          <Link 
            to={`/hotels/${hotel.id}`} 
            key={hotel.id}
            className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <img 
                  src={hotel.image} 
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <div className="p-4 md:w-2/3">
                <div className="flex justify-between">
                  <h3 className="text-xl font-semibold">{hotel.name}</h3>
                  <div className="flex items-center bg-blue-100 px-2 py-1 rounded">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="ml-1 text-sm">{hotel.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mt-1">
                  {hotel.location} | {hotel.distance}
                </p>
                
                <div className="mt-3 space-y-1">
                  {hotel.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✔</span>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">⭐ {hotel.reviewCount.toLocaleString()} reviews</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{hotel.price}</p>
                    <p className="text-sm text-gray-600">Par nuit</p>
                    <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default NearbyHotels;