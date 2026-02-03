'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Heart,
  Share2,
  Star,
  Users,
  ChevronRight,
  Car,
  Shield,
  Headphones,
  Wrench,
  Truck,
  Navigation,
} from 'lucide-react';
import { Agency, AgencyReview } from '@/types/agencyType';
import { Vehicle } from '@/types/vehicleType';
import { agencyService } from '@/services/agencyService';
import { vehicleService } from '@/services/vehicleService';
import { ImageGallery } from '@/components/ImageGallery';
import { StarRating } from '@/components/StarRating';
import { TestimonialCard } from '@/components/TestimonialCard';
import { AgencyCard } from '@/components/AgencyCard';

// Map service icons to components
const serviceIcons: Record<string, typeof Car> = {
  'Livraison véhicule': Truck,
  'Support 24/7': Headphones,
  'Assurance complète': Shield,
  'Maintenance': Wrench,
  'Assurance': Shield,
  'GPS inclus': Navigation,
  'Service VIP': Star,
  'Chauffeur disponible': Users,
  'Véhicules luxe': Car,
};

export default function AgencyDetailsPage() {
  const params = useParams();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [reviews, setReviews] = useState<AgencyReview[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [similarAgencies, setSimilarAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const id = params.id as string;

        // Load agency
        const agencyData = await agencyService.getAgencyById(id);
        setAgency(agencyData || null);

        // Load reviews
        const reviewsData = await agencyService.getAgencyReviews(id);
        setReviews(reviewsData);

        // Load vehicles from this agency (mock - using all vehicles)
        const vehiclesData = await vehicleService.getAllAvailableVehicles();
        setVehicles(vehiclesData.slice(0, 4));

        // Load similar agencies
        const allAgencies = await agencyService.getAllAgencies();
        const similar = allAgencies.filter((a) => a.id !== id).slice(0, 3);
        setSimilarAgencies(similar);
      } catch (error) {
        console.error('Error loading agency:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8" />
            <div className="h-96 bg-gray-200 rounded-xl mb-4" />
            <div className="h-20 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Agence non trouvée</h1>
          <Link href="/agencies" className="text-blue-600 hover:underline">
            Retour à la liste des agences
          </Link>
        </div>
      </div>
    );
  }

  // Calculate rating distribution (mock)
  const ratingDistribution = {
    5: 65,
    4: 20,
    3: 10,
    2: 3,
    1: 2,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/agencies"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft size={20} />
          <span>Retour aux agences</span>
        </Link>

        {/* Agency Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    agency.type === 'headquarters'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {agency.type === 'headquarters' ? 'Siège' : 'Agence'}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    agency.isOpen
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {agency.isOpen ? 'Ouvert' : 'Fermé'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{agency.name}</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={18} />
                <span>{agency.address}, {agency.city}, {agency.region}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  isFollowing
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Heart size={18} className={isFollowing ? 'fill-current' : ''} />
                <span>{isFollowing ? 'Suivi' : 'Suivre'}</span>
              </button>
              <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Rating and Stats */}
          <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t">
            <div className="flex items-center gap-2">
              <StarRating rating={agency.rating} size={20} showValue />
              <span className="text-gray-500">({agency.reviewCount} avis)</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users size={18} />
              <span>{agency.followerCount} abonnés</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={18} />
              <span>{agency.openingHours.open} - {agency.openingHours.close}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ImageGallery images={agency.images} alt={agency.name} />

            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">À propos</h2>
              <p className="text-gray-600 leading-relaxed">{agency.description}</p>
            </div>

            {/* Services */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Services & Équipements</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {agency.services.map((service, index) => {
                  const IconComponent = serviceIcons[service] || Star;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent size={20} className="text-blue-600" />
                      </div>
                      <span className="text-gray-700">{service}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vehicles */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Véhicules disponibles</h2>
                <Link
                  href="/cars"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Voir tout
                  <ChevronRight size={18} />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {vehicles.map((vehicle) => (
                  <Link key={vehicle.id} href={`/cars/${vehicle.id}`}>
                    <div className="group cursor-pointer">
                      <div className="relative h-28 rounded-lg overflow-hidden mb-2">
                        <Image
                          src={vehicle.image || '/client/images/placeholder-car.jpg'}
                          alt={vehicle.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {vehicle.name}
                      </p>
                      <p className="text-blue-600 font-bold text-sm">
                        {vehicle.pricePerDay.toLocaleString()} FCFA/jour
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Avis clients</h2>
                <button className="text-blue-600 hover:text-blue-700 font-semibold">
                  Écrire un avis
                </button>
              </div>

              {/* Rating Overview */}
              <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b">
                <div className="text-center">
                  <p className="text-5xl font-bold text-gray-900">{agency.rating}</p>
                  <StarRating rating={agency.rating} size={20} />
                  <p className="text-gray-500 mt-2">{agency.reviewCount} avis</p>
                </div>
                <div className="flex-1">
                  {Object.entries(ratingDistribution)
                    .reverse()
                    .map(([stars, percentage]) => (
                      <div key={stars} className="flex items-center gap-2 mb-2">
                        <span className="w-8 text-sm text-gray-600">{stars}</span>
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-10 text-sm text-gray-500">{percentage}%</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <TestimonialCard
                      key={review.id}
                      name={review.userName}
                      photo={review.userPhoto}
                      rating={review.rating}
                      comment={review.comment}
                      date={review.createdAt}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Aucun avis pour le moment
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Informations de contact</h3>
                <div className="space-y-3">
                  <a
                    href={`tel:${agency.phone}`}
                    className="flex items-center gap-3 text-gray-600 hover:text-blue-600"
                  >
                    <Phone size={18} />
                    <span>{agency.phone}</span>
                  </a>
                  <a
                    href={`mailto:${agency.email}`}
                    className="flex items-center gap-3 text-gray-600 hover:text-blue-600"
                  >
                    <Mail size={18} />
                    <span>{agency.email}</span>
                  </a>
                  {agency.website && (
                    <a
                      href={agency.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-600 hover:text-blue-600"
                    >
                      <Globe size={18} />
                      <span>Visiter le site</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Hours */}
              <div className="pt-6 border-t">
                <h3 className="font-bold text-gray-900 mb-4">Heures d&apos;ouverture</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Horaires</span>
                    <span className="font-medium">
                      {agency.openingHours.open} - {agency.openingHours.close}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jours</span>
                    <span className="font-medium text-right">
                      {agency.openingHours.days.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="pt-6 border-t">
                <h3 className="font-bold text-gray-900 mb-4">Adresse</h3>
                <p className="text-gray-600 mb-4">
                  {agency.address}<br />
                  {agency.city}, {agency.region}
                </p>
                {/* Map placeholder */}
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Carte</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t space-y-3">
                <Link
                  href="/cars"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-semibold transition-colors"
                >
                  Voir les véhicules
                </Link>
                <a
                  href={`tel:${agency.phone}`}
                  className="block w-full border border-blue-600 text-blue-600 hover:bg-blue-50 text-center py-3 rounded-lg font-semibold transition-colors"
                >
                  Contacter l&apos;agence
                </a>
                <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  <Navigation size={18} />
                  Itinéraire
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Agencies */}
        {similarAgencies.length > 0 && (
          <section className="mt-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Agences similaires</h2>
              <Link
                href="/agencies"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Voir tout
                <ChevronRight size={20} />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {similarAgencies.map((a) => (
                <AgencyCard key={a.id} agency={a} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
