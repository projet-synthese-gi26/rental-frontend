'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  UserPlus2,
  User2,
  Timer,
  IdCard,
  Phone,
  Mail
} from 'lucide-react';
import { driverService } from '@/services/driverService';
import { Driver } from '@/types/driverType';
import NoElementFound from '@/components/NoElementFound';
import Image from 'next/image';

interface DriverPageProps {
  params: {
    id: string;
  };
}

export default function DriverPage({ params }: DriverPageProps) {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  
  const router = useRouter();
  const driverId = parseInt(params.id);

  useEffect(() => {
    loadDriver();
  }, [driverId]);

  const loadDriver = async () => {
    try {
      setLoading(true);
      const data = await driverService.getDriverById(driverId);
      
      if (!data) {
        setError('Véhicule non trouvé');
        return;
      }
      
      setDriver(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement du véhicule');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <NoElementFound
            icon={User2}
            element={'driver'}
            onButtonClick={() => router.push('/drivers')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Retour
            </button>
          
          </div>
        </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
          <div className="lg:col-span-2">
            {/* Image principale */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-6">
              <div className="relative h-96 ">
                <Image
                  src={driver.image}
                  alt={driver.name}
                  fill
                  className="object-cover"
                />
                {!driver.available && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold bg-red-600 px-6 py-3 rounded-lg">
                      Non disponible
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Informations détaillées */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">{driver.name}</h1>
                  </div>
                  <div className="flex items-center bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                    <Star size={16} className="fill-current mr-1" />
                    <span className="font-semibold">{driver.rating}</span>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Description
              </h2>
              <p className="text-gray-600 mb-6">
                {driver.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Timer className="mx-auto text-blue-600 mb-2" size={24} />
                  <div className="text-sm text-gray-500">Age</div>
                  <div className="font-semibold">{driver.age?.toLocaleString() || '---'} years old</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <IdCard className="mx-auto text-green-600 mb-2" size={24} />
                  <div className="text-sm text-gray-500">Permis</div>
                  <div className="font-semibold capitalize">{driver.permiscode}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Phone className="mx-auto text-orange-600 mb-2" size={24} />
                  <div className="text-sm text-gray-500">Phone number</div>
                  <div className="font-semibold capitalize">{driver.phone}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Mail className="mx-auto text-orange-600 mb-2" size={24} />
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-semibold capitalize">{driver.email}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <MapPin className="mx-auto text-purple-600 mb-2" size={24} />
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-semibold">{driver.location}</div>
                </div>
                {/* Prix */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Prix par jour</span>
                  <span className="text-3xl font-bold text-blue-600">
                    ${driver.pricePerDay}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Taxes et frais inclus
                </p>
              </div>
              </div>
              <button onClick={() => router.push("/rental-process/policy")} className="w-full py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
                  <UserPlus2 size={20} className="inline mr-2" />
                  Book this driver
              </button>
            </div>
          </div>
        </div>
     
    </div>
  );
}