'use client';

import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from '@react-google-maps/api';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

interface Hospital {
  id: string;
  name: string;
  address: string;
  rating: number;
  position: {
    lat: number;
    lng: number;
  };
}

const hospitals: Hospital[] = [
  {
    id: '1',
    name: 'King Abdulaziz Hospital - Makkah',
    address: 'Al-Hajoun, 24222, Saudi Arabia',
    rating: 3.0,
    position: { lat: 21.4358, lng: 39.8256 },
  },
  {
    id: '2',
    name: 'King Faisal Hospital - Makkah',
    address:
      '4358, Prince Majed Ibn Abd Al Aziz, 7451, Al Muabdah, Makkah 24236, Saudi Arabia',
    rating: 3.0,
    position: { lat: 21.4225, lng: 39.8233 },
  },
  {
    id: '3',
    name: 'Heraa General Hospital',
    address: 'Al Masfalah Al Munawarah Rd, Makkah 24227, Saudi Arabia',
    rating: 2.8,
    position: { lat: 21.4147, lng: 39.8213 },
  },
  {
    id: '4',
    name: 'Al-Noor Specialist Hospital',
    address: '3rd Ring Rd, Al Hijrah, Makkah 24341, Saudi Arabia',
    rating: 3.1,
    position: { lat: 21.4203, lng: 39.8158 },
  },
  {
    id: '5',
    name: 'Makkah Ajyad Emergency Hospital',
    address: 'Abatwa Tower, Ajyad St, Al Haram, Makkah 24231, Saudi Arabia',
    rating: 3.2,
    position: { lat: 21.4189, lng: 39.8267 },
  },
  {
    id: '6',
    name: 'King Abdullah Medical City Specialist Hospital',
    address: 'Muzdalifah Rd, Al-shahar, Makkah 24246, Saudi Arabia',
    rating: 4.1,
    position: { lat: 21.4281, lng: 39.8144 },
  },
  {
    id: '7',
    name: 'Maternity and Children Hospital',
    address: 'An Nuzha, Makkah, Saudi Arabia',
    rating: 2.8,
    position: { lat: 21.4306, lng: 39.8189 },
  },
];

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 180px)', // Full height minus header and cards
};

const center = {
  lat: 21.4225,
  lng: 39.8233,
};

export default function LocationsPage() {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  );
  const [activeMarker, setActiveMarker] = useState<Hospital | null>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300; // Scroll by roughly one card width
    const newScrollLeft =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Show/hide scroll buttons based on scroll position
    setShowLeftScroll(container.scrollLeft > 0);
    setShowRightScroll(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Back Button */}
      <div className="p-4 bg-white shadow-sm">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Go back</span>
        </button>
      </div>

      {/* Google Maps Section */}
      <div className="flex-1 relative">
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={selectedHospital?.position || center}
            zoom={14}
            options={{
              fullscreenControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              zoomControl: true,
            }}
          >
            {hospitals.map((hospital) => (
              <Marker
                key={hospital.id}
                position={hospital.position}
                onClick={() => {
                  setActiveMarker(hospital);
                  setSelectedHospital(hospital);
                }}
              />
            ))}
            {activeMarker && (
              <InfoWindow
                position={activeMarker.position}
                onCloseClick={() => setActiveMarker(null)}
              >
                <div>
                  <h3 className="font-semibold">{activeMarker.name}</h3>
                  <p className="text-sm">{activeMarker.address}</p>
                  <p className="text-sm">Rating: {activeMarker.rating} ⭐</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Horizontal Scrollable Hospital Cards with Scroll Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
        <div className="relative">
          {/* Left Scroll Button */}
          {showLeftScroll && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
          )}

          {/* Right Scroll Button */}
          {showRightScroll && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              style={{ transform: 'translate(50%, -50%)' }}
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          )}

          {/* Cards Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 p-4 no-scrollbar scroll-smooth"
            onScroll={handleScroll}
          >
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className={`flex-none w-[280px] p-4 rounded-lg shadow-md cursor-pointer transition-all duration-200
                  ${
                    selectedHospital?.id === hospital.id
                      ? 'bg-[#F3F0FF] border border-[#6b6291]'
                      : 'bg-white hover:shadow-lg'
                  }`}
                onClick={() => {
                  setSelectedHospital(hospital);
                  setActiveMarker(hospital);
                }}
              >
                <h3 className="font-semibold text-base mb-1">
                  {hospital.name}
                </h3>
                <p className="text-gray-500 text-sm mb-2">{hospital.address}</p>
                <div className="flex items-center">
                  <span className="text-sm">{hospital.rating}</span>
                  <span className="text-yellow-400 ml-1">★</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
