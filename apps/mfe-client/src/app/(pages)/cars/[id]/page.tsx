'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Users,
  Fuel,
  Settings2,
  MapPin,
  Heart,
  Share2,
  Calendar,
  Wind,
  Navigation,
  Bluetooth,
  DoorOpen,
  Briefcase,
  Star,
  ChevronRight,
} from 'lucide-react';
import { Vehicle } from '@/types/vehicleType';
import { vehicleService } from '@/services/vehicleService';
import { ImageGallery } from '@/components/ImageGallery';
import { StarRating } from '@/components/StarRating';
import { TestimonialCard } from '@/components/TestimonialCard';
import { useReservationStore } from '@/store/workflow.store';

// Mock reviews
const mockReviews = [
  {
    name: 'Jean Dupont',
    photo: '/client/images/users/user-1.jpg',
    rating: 5,
    comment: 'Excellent véhicule, très confortable et économique. Le processus de location était simple.',
    date: '2024-01-15',
  },
  {
    name: 'Marie Nguema',
    rating: 4,
    comment: 'Bonne expérience globale. La voiture était propre et bien entretenue.',
    date: '2024-01-10',
  },
];

export default function CarDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarVehicles, setSimilarVehicles] = useState<Vehicle[]>([]);
  const [selectedPriceType, setSelectedPriceType] = useState<'day' | 'week' | 'month'>('day');
  const [isFavorite, setIsFavorite] = useState(false);

  const { setVehicle: setStoreVehicle, setBookingDates } = useReservationStore();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const id = Number(params.id);
        const data = await vehicleService.getVehicleById(id);
        setVehicle(data || null);

        // Load similar vehicles
        const allVehicles = await vehicleService.getAllAvailableVehicles();
        const similar = allVehicles
          .filter((v) => v.id !== id && v.type === data?.type)
          .slice(0, 4);
        setSimilarVehicles(similar);
      } catch (error) {
        console.error('Error loading vehicle:', error);
      } finally {
        setLoading(false);
      }
    };
    loadVehicle();
  }, [params.id]);

  const handleBookNow = () => {
    if (vehicle && startDate && endDate) {
      setStoreVehicle(vehicle);
      setBookingDates(startDate, endDate);
      router.push(`/cars/${vehicle.id}/location`);
    }
  };

  const getPriceDisplay = () => {
    if (!vehicle) return 0;
    switch (selectedPriceType) {
      case 'week':
        return vehicle.pricePerDay * 7 * 0.9; // 10% discount for weekly
      case 'month':
        return vehicle.pricePerDay * 30 * 0.8; // 20% discount for monthly
      default:
        return vehicle.pricePerDay;
    }
  };

  const specifications = vehicle
    ? [
        { icon: Users, label: 'Passagers', value: `${vehicle.passengers} places` },
        { icon: DoorOpen, label: 'Portes', value: '4 portes' },
        { icon: Settings2, label: 'Transmission', value: vehicle.transmission },
        { icon: Fuel, label: 'Carburant', value: vehicle.fuelType },
        { icon: Briefcase, label: 'Bagages', value: '3 valises' },
        { icon: Wind, label: 'Climatisation', value: vehicle.airConditioning ? 'Oui' : 'Non' },
        { icon: Navigation, label: 'GPS', value: vehicle.gps ? 'Inclus' : 'Non' },
        { icon: Bluetooth, label: 'Bluetooth', value: 'Oui' },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-200 rounded-xl mb-4" />
                <div className="h-20 bg-gray-200 rounded-xl" />
              </div>
              <div className="h-[500px] bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Véhicule non trouvé</h1>
          <Link href="/cars" className="text-blue-600 hover:underline">
            Retour à la liste des véhicules
          </Link>
        </div>
      </div>
    );
  }

  // Generate mock images array
  const images = [
    vehicle.image,
    vehicle.image,
    vehicle.image,
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft size={20} />
          <span>Retour aux véhicules</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ImageGallery images={images} alt={vehicle.name} />

            {/* Vehicle Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full font-semibold mb-2">
                    {vehicle.type}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900">{vehicle.name}</h1>
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <MapPin size={16} />
                    <span>{vehicle.location}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 rounded-full border transition-colors ${
                      isFavorite
                        ? 'bg-red-50 border-red-200 text-red-500'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                  </button>
                  <button className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <StarRating rating={vehicle.rating} size={18} showValue />
                <span className="text-gray-500">(42 avis)</span>
              </div>

              {/* Price Tabs */}
              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  {(['day', 'week', 'month'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedPriceType(type)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        selectedPriceType === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {type === 'day' && 'Journée'}
                      {type === 'week' && 'Semaine'}
                      {type === 'month' && 'Mois'}
                    </button>
                  ))}
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  {getPriceDisplay().toLocaleString()} FCFA
                  <span className="text-gray-500 font-normal text-lg">
                    /{selectedPriceType === 'day' ? 'jour' : selectedPriceType === 'week' ? 'semaine' : 'mois'}
                  </span>
                </p>
              </div>

              {/* Specifications */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Caractéristiques</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <spec.icon size={24} className="text-blue-600 mb-2" />
                      <span className="text-sm text-gray-500">{spec.label}</span>
                      <span className="font-semibold text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {vehicle.description ||
                    `Le ${vehicle.name} est un véhicule ${vehicle.type} de la marque ${vehicle.brand}.
                    Avec ses ${vehicle.passengers} places et sa transmission ${vehicle.transmission},
                    c'est le choix idéal pour vos déplacements. Ce véhicule offre un excellent confort
                    et une consommation économique.`}
                </p>
              </div>

              {/* Features */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Équipements</h2>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Avis clients</h2>
                <div className="flex items-center gap-2">
                  <Star size={20} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-lg font-bold">{vehicle.rating}</span>
                  <span className="text-gray-500">(42 avis)</span>
                </div>
              </div>

              <div className="space-y-4">
                {mockReviews.map((review, index) => (
                  <TestimonialCard key={index} {...review} />
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Réserver ce véhicule</h2>

              {/* Date Selection */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début
                  </label>
                  <div className="relative">
                    <Calendar
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin
                  </label>
                  <div className="relative">
                    <Calendar
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              {startDate && endDate && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>Prix par jour</span>
                    <span>{vehicle.pricePerDay.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>Durée</span>
                    <span>
                      {Math.ceil(
                        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
                          (1000 * 3600 * 24)
                      )}{' '}
                      jour(s)
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>Taxes et frais</span>
                    <span>Inclus</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-blue-600">
                        {(
                          vehicle.pricePerDay *
                          Math.ceil(
                            (new Date(endDate).getTime() -
                              new Date(startDate).getTime()) /
                              (1000 * 3600 * 24)
                          )
                        ).toLocaleString()}{' '}
                        FCFA
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <button
                onClick={handleBookNow}
                disabled={!startDate || !endDate}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg transition-colors"
              >
                Réserver maintenant
              </button>

              <p className="text-center text-gray-500 text-sm mt-4">
                Annulation gratuite sous 24h
              </p>
            </div>
          </div>
        </div>

        {/* Similar Vehicles */}
        {similarVehicles.length > 0 && (
          <section className="mt-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Véhicules similaires</h2>
              <Link
                href="/cars"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Voir tout
                <ChevronRight size={20} />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarVehicles.map((v) => (
                <Link key={v.id} href={`/cars/${v.id}`}>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all group">
                    <div className="relative h-40">
                      <Image
                        src={v.image || '/client/images/placeholder-car.jpg'}
                        alt={v.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900">{v.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <StarRating rating={v.rating} size={12} />
                        <p className="text-blue-600 font-bold">
                          {v.pricePerDay.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
