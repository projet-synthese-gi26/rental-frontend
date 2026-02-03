'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, Star, Car, Users, Fuel, Settings2, ChevronDown, X } from 'lucide-react';
import { Vehicle } from '@/types/vehicleType';
import { vehicleService } from '@/services/vehicleService';
import { StarRating } from '@/components/StarRating';
import NoElementFound from '@/components/NoElementFound';

// Vehicle type options
const vehicleTypes = [
  { value: 'all', label: 'Tous les types' },
  { value: 'berline', label: 'Berline' },
  { value: 'suv', label: 'SUV' },
  { value: 'compacte', label: 'Compacte' },
  { value: 'luxe', label: 'Luxe' },
  { value: 'sport', label: 'Sport' },
  { value: 'utilitaire', label: 'Utilitaire' },
  { value: 'electrique', label: 'Électrique' },
];

// Passenger capacity options
const passengerOptions = [
  { value: 0, label: 'Tous' },
  { value: 2, label: '2 places' },
  { value: 4, label: '4 places' },
  { value: 5, label: '5 places' },
  { value: 7, label: '7+ places' },
];

// Sort options
const sortOptions = [
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Meilleures notes' },
  { value: 'name', label: 'Nom A-Z' },
];

export default function CarsListingPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [minPassengers, setMinPassengers] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState('price-asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await vehicleService.getAllAvailableVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort vehicles
  const filteredVehicles = vehicles
    .filter((vehicle) => {
      // Search filter
      const matchesSearch =
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.type.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const matchesType =
        selectedType === 'all' ||
        vehicle.type.toLowerCase() === selectedType.toLowerCase();

      // Passengers filter
      const matchesPassengers =
        minPassengers === 0 || vehicle.passengers >= minPassengers;

      // Price filter
      const matchesPrice =
        vehicle.pricePerDay >= priceRange[0] &&
        vehicle.pricePerDay <= priceRange[1];

      return matchesSearch && matchesType && matchesPassengers && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.pricePerDay - b.pricePerDay;
        case 'price-desc':
          return b.pricePerDay - a.pricePerDay;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setMinPassengers(0);
    setPriceRange([0, 500]);
    setSortBy('price-asc');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Trouvez le véhicule parfait
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Large sélection de véhicules pour tous vos besoins. Prix transparents et location flexible.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Rechercher par nom, marque ou type..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filtres</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Réinitialiser
                </button>
              </div>

              {/* Vehicle Type */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Type de véhicule</h3>
                <div className="space-y-2">
                  {vehicleTypes.map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="vehicleType"
                        checked={selectedType === type.value}
                        onChange={() => setSelectedType(type.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Passengers */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Capacité passagers</h3>
                <div className="space-y-2">
                  {passengerOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="passengers"
                        checked={minPassengers === option.value}
                        onChange={() => setMinPassengers(option.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Prix par jour: {priceRange[0]} - {priceRange[1]} FCFA
                </h3>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>0 FCFA</span>
                  <span>500 FCFA</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(true)}
                className="w-full flex items-center justify-center gap-2 bg-white py-3 px-4 rounded-lg shadow-md"
              >
                <Filter size={20} />
                <span>Filtres</span>
              </button>
            </div>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Nos véhicules</h2>
                <p className="text-gray-600">
                  {filteredVehicles.length} véhicule(s) disponible(s)
                </p>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">Trier par:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-200 rounded-xl h-80 animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* Vehicles Grid */}
            {!loading && filteredVehicles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <Link key={vehicle.id} href={`/cars/${vehicle.id}`}>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                      {/* Image */}
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

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {vehicle.name}
                          </h3>
                          <StarRating rating={vehicle.rating} size={14} showValue />
                        </div>

                        {/* Features */}
                        <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            <span>{vehicle.passengers}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Settings2 size={14} />
                            <span>{vehicle.transmission}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Fuel size={14} />
                            <span>{vehicle.fuelType}</span>
                          </div>
                        </div>

                        {/* Price and CTA */}
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <p className="text-blue-600 font-bold text-lg">
                            {vehicle.pricePerDay.toLocaleString()} FCFA
                            <span className="text-gray-500 font-normal text-sm">
                              /jour
                            </span>
                          </p>
                          <span className="text-blue-600 font-semibold text-sm group-hover:underline">
                            Voir détails
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && filteredVehicles.length === 0 && (
              <NoElementFound
                element="véhicule"
                icon={Car}
                onButtonClick={clearFilters}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filtres</h2>
                <button onClick={() => setShowFilters(false)}>
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              {/* Same filters as sidebar */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Type de véhicule
                </h3>
                <div className="space-y-2">
                  {vehicleTypes.map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="vehicleTypeMobile"
                        checked={selectedType === type.value}
                        onChange={() => setSelectedType(type.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Capacité passagers
                </h3>
                <div className="space-y-2">
                  {passengerOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="passengersMobile"
                        checked={minPassengers === option.value}
                        onChange={() => setMinPassengers(option.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700"
                >
                  Réinitialiser
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
