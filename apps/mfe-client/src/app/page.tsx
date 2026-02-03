'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Car, Shield, Clock, CreditCard, Users, Star, ChevronRight, MapPin } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/footer';
import { LocationFilter } from '@/components/LocationFilter';
import { StarRating } from '@/components/StarRating';
import { TestimonialCard } from '@/components/TestimonialCard';
import { vehicleService } from '@/services/vehicleService';
import { Vehicle } from '@/types/vehicleType';

// Rental steps data
const rentalSteps = [
  {
    number: '01',
    title: 'Choisissez votre véhicule',
    description: 'Parcourez notre large sélection de véhicules et trouvez celui qui correspond à vos besoins.',
    icon: Car,
  },
  {
    number: '02',
    title: 'Réservez en ligne',
    description: 'Sélectionnez vos dates, votre lieu de prise en charge et confirmez votre réservation.',
    icon: Clock,
  },
  {
    number: '03',
    title: 'Paiement sécurisé',
    description: 'Payez en toute sécurité via nos différentes options de paiement.',
    icon: CreditCard,
  },
  {
    number: '04',
    title: 'Profitez de votre trajet',
    description: 'Récupérez votre véhicule et partez à l\'aventure!',
    icon: Shield,
  },
];

// Testimonials data
const testimonials = [
  {
    name: 'Jean-Pierre Nguema',
    photo: '/client/images/users/user-1.jpg',
    rating: 5,
    comment: 'Service impeccable! La voiture était en parfait état et le personnel très professionnel. Je recommande vivement EasyRent pour tous vos besoins de location.',
    date: '2024-01-15',
  },
  {
    name: 'Marie Atangana',
    rating: 4.5,
    comment: 'Très satisfaite de mon expérience. Le processus de réservation était simple et le véhicule correspondait parfaitement à mes attentes.',
    date: '2024-01-10',
  },
  {
    name: 'Paul Kamga',
    photo: '/client/images/users/user-3.jpg',
    rating: 5,
    comment: 'Excellente agence! Prix compétitifs et service client au top. Je suis client régulier maintenant.',
    date: '2024-01-08',
  },
];

// Services data
const services = [
  {
    icon: Car,
    title: 'Large choix de véhicules',
    description: 'Des citadines aux SUV de luxe, trouvez le véhicule parfait pour chaque occasion.',
  },
  {
    icon: Shield,
    title: 'Assurance complète',
    description: 'Roulez en toute tranquillité avec nos options d\'assurance tous risques.',
  },
  {
    icon: Clock,
    title: 'Service 24/7',
    description: 'Notre équipe est disponible à tout moment pour vous assister.',
  },
  {
    icon: Users,
    title: 'Chauffeurs professionnels',
    description: 'Optez pour nos chauffeurs expérimentés pour un confort optimal.',
  },
];

// Stats data
const stats = [
  { value: '500+', label: 'Véhicules disponibles' },
  { value: '10K+', label: 'Clients satisfaits' },
  { value: '15+', label: 'Villes couvertes' },
  { value: '4.8', label: 'Note moyenne' },
];

export default function HomePage() {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const vehicles = await vehicleService.getAllAvailableVehicles();
        setFeaturedVehicles(vehicles.slice(0, 4));
      } catch (error) {
        console.error('Error loading vehicles:', error);
      } finally {
        setLoading(false);
      }
    };
    loadVehicles();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }} />
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Fast & Easy Way To <span className="text-orange-400">Rent A Car</span>
              </h1>
              <p className="text-xl text-blue-100 max-w-xl">
                Découvrez la liberté de la route avec EasyRent. Des véhicules de qualité, des prix transparents et un service client exceptionnel.
              </p>

              {/* Play Button */}
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full transition-colors">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <Play size={20} className="text-white ml-1" />
                  </div>
                  <span className="text-lg font-medium">Comment ça marche</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/20">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <p className="text-3xl font-bold text-orange-400">{stat.value}</p>
                    <p className="text-blue-200 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Car Image */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-[500px]">
                <Image
                  src="/client/images/hero-car.png"
                  alt="Luxury Car"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar - Positioned at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 px-4">
          <div className="container mx-auto">
            <LocationFilter className="max-w-5xl mx-auto" />
          </div>
        </div>
      </section>

      {/* Spacer for search bar */}
      <div className="h-24" />

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Better Way to Rent Your Perfect Cars
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Louez un véhicule en quelques étapes simples. Rapide, facile et sécurisé.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {rentalSteps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < rentalSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-blue-200" />
                )}

                <div className="bg-white rounded-xl p-6 shadow-lg relative z-10 hover:shadow-xl transition-shadow">
                  {/* Step Number */}
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                    <step.icon size={28} className="text-white" />
                  </div>
                  <span className="text-sm text-blue-600 font-semibold">Étape {step.number}</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-blue-600 font-semibold">What We Offer</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                Featured Vehicles
              </h2>
            </div>
            <Link
              href="/cars"
              className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Voir tous les véhicules
              <ChevronRight size={20} />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredVehicles.map((vehicle) => (
                <Link key={vehicle.id} href={`/cars/${vehicle.id}`}>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all group">
                    <div className="relative h-48">
                      <Image
                        src={vehicle.image || '/client/images/placeholder-car.jpg'}
                        alt={vehicle.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-semibold">
                        {vehicle.type}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                        <MapPin size={14} />
                        <span>{vehicle.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <StarRating rating={vehicle.rating} size={14} showValue />
                        <p className="text-blue-600 font-bold">
                          {vehicle.pricePerDay.toLocaleString()} FCFA<span className="text-gray-500 font-normal text-sm">/jour</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Voir tous les véhicules
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Services</h2>
            <p className="text-blue-200 max-w-2xl mx-auto">
              EasyRent vous offre une expérience de location complète et personnalisée.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors"
              >
                <div className="w-14 h-14 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <service.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-blue-200">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section for Drivers */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Devenez chauffeur partenaire
              </h2>
              <p className="text-orange-100 text-lg mb-8">
                Rejoignez notre réseau de chauffeurs professionnels et augmentez vos revenus.
                Flexibilité, autonomie et accompagnement garanti.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg font-bold hover:bg-orange-50 transition-colors"
              >
                Nous contacter
              </Link>
            </div>
            <div className="relative h-64 lg:h-80">
              <Image
                src="/client/images/driver-cta.png"
                alt="Become a driver"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
            <div className="flex items-center justify-center gap-2">
              <Star size={24} className="text-yellow-400 fill-yellow-400" />
              <span className="text-2xl font-bold">4.8</span>
              <span className="text-gray-500">basé sur 2,500+ avis</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à prendre la route?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Réservez votre véhicule dès maintenant et profitez de tarifs exceptionnels.
          </p>
          <Link
            href="/cars"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Explorer nos véhicules
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
