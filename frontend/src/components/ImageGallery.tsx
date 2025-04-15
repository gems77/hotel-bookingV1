import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Si pas d'images, afficher un placeholder
  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
        <Camera size={48} className="text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-lg">
      <img
        src={images[currentIndex]}
        alt={`${alt} - image ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />

      {/* Compteur de photos */}
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-sm">
        <Camera size={16} className="inline mr-1" />
        {currentIndex + 1} / {images.length}
      </div>

      {/* Boutons de navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === 0 ? images.length - 1 : prev - 1
              )
            }
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-1 rounded-full"
            aria-label="Image précédente"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % images.length)
            }
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-1 rounded-full"
            aria-label="Image suivante"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  );
};

export default ImageGallery;
