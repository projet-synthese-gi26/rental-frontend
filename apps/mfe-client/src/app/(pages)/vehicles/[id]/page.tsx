'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Car, 
  Fuel, 
  Settings, 
//   Calendar, 
  MapPin,  
  Wifi, 
  Music, 
  Snowflake,
  CheckCircle,
//   CreditCard,
  Share2,
  Heart
} from 'lucide-react';
import { vehicleService } from '@/services/vehicleService';
import { Vehicle } from '@/types/vehicleType';
import NoElementFound from '@/components/NoElementFound';
import Image from 'next/image';
import ReservationCard from '@/components/reservationCard';
// import Link from 'next/link';

interface VehiclePageProps {
  params: {
    id: string;
  };
}

export default function VehiclePage({ params }: VehiclePageProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
 
  
  const router = useRouter();
  const vehicleId = parseInt(params.id);

  useEffect(() => {
     const loadVehicle = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getVehicleById(vehicleId);
      
      if (!data) {
        setError('Véhicule non trouvé');
        return;
      }
      
      setVehicle(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement du véhicule');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
    loadVehicle();
  }, []);

  // const calculateTotalPrice = () => {
  //   const days = bookingDates.days || 1;
  //   return vehicle ? vehicle.pricePerDay * days : 0;
  // };

  const images = vehicle ? [
    vehicle.image,
    vehicle.image,
    vehicle.image,
    vehicle.image,
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <NoElementFound
            icon={Car}
            element={'vehicle'}
            onButtonClick={() => router.push('/vehicles')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Retour
            </button>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Heart 
                  size={20} 
                  className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'} 
                />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Share2 size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Images et détails */}
          <div className="lg:col-span-2">
            {/* Image principale */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-6">
              <div className="relative h-96">
                <Image
                  src={images[selectedImage]}
                  alt={vehicle.name}
                  fill
                  className="w-full h-full object-cover"
                />
                {!vehicle.available && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold bg-red-600 px-6 py-3 rounded-lg">
                      Non disponible
                    </span>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
                  <span className="text-sm">Photo {selectedImage + 1}/{images.length}</span>
                </div>
              </div>
              
              {/* Galerie d'images */}
              <div className="p-4 grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${vehicle.name} vue ${index + 1}`}
                      fill
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Informations détaillées */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Description
              </h2>
              <p className="text-gray-600 mb-6">
                {vehicle.description || `Véhicule ${vehicle.brand} ${vehicle.model} ${vehicle.year} en excellent état. Idéal pour vos déplacements professionnels ou personnels.`}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Car className="mx-auto text-blue-600 mb-2" size={24} />
                  <div className="text-sm text-gray-500">Kilométrage</div>
                  <div className="font-semibold">{vehicle.mileage?.toLocaleString() || '---'} km</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Settings className="mx-auto text-green-600 mb-2" size={24} />
                  <div className="text-sm text-gray-500">Transmission</div>
                  <div className="font-semibold capitalize">{vehicle.transmission}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Fuel className="mx-auto text-orange-600 mb-2" size={24} />
                  <div className="text-sm text-gray-500">Carburant</div>
                  <div className="font-semibold capitalize">{vehicle.fuelType}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <MapPin className="mx-auto text-purple-600 mb-2" size={24} />
                  <div className="text-sm text-gray-500">Localisation</div>
                  <div className="font-semibold">{vehicle.location}</div>
                </div>
              </div>
            </div>

            {/* Équipements */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Équipements & Options
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicle.features.map((feature, index) => (
                  <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                    <CheckCircle size={18} className="text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                
                {/* Équipements standards */}
                {vehicle.airConditioning && (
                  <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                    <Snowflake size={18} className="text-blue-500 mr-3" />
                    <span className="text-gray-700">Climatisation automatique</span>
                  </div>
                )}
                
                {vehicle.gps && (
                  <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                    <MapPin size={18} className="text-red-500 mr-3" />
                    <span className="text-gray-700">GPS intégré</span>
                  </div>
                )}
                
                <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                  <Music size={18} className="text-purple-500 mr-3" />
                  <span className="text-gray-700">Système audio Bluetooth</span>
                </div>
                
                <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                  <Wifi size={18} className="text-indigo-500 mr-3" />
                  <span className="text-gray-700">WiFi hotspot</span>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Réservation */}
          <div>
            <ReservationCard/>
            {/* Carte de réservation */}
           

            {/* Contact */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Need help ?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Notre équipe est disponible 7j/7 pour répondre à vos questions.
              </p>
              <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                Contacter le support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}