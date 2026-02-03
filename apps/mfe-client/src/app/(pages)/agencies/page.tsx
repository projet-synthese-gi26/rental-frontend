'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Building2, MapPin, Star, Users, ChevronDown, X } from 'lucide-react';
import { Agency } from '@/types/agencyType';
import { agencyService } from '@/services/agencyService';
import { AgencyCard } from '@/components/AgencyCard';
import NoElementFound from '@/components/NoElementFound';

// Filter options
const cities = ['Toutes', 'Yaoundé', 'Douala', 'Bafoussam', 'Bamenda', 'Garoua'];
const ratingOptions = [
  { value: 0, label: 'Toutes' },
  { value: 5, label: '5 étoiles' },
  { value: 4, label: '4+ étoiles' },
  { value: 3, label: '3+ étoiles' },
];
const typeOptions = [
  { value: 'all', label: 'Tous types' },
  { value: 'headquarters', label: 'Siège' },
  { value: 'branch', label: 'Agence' },
];
const sortOptions = [
  { value: 'rating', label: 'Meilleures notes' },
  { value: 'followers', label: 'Plus suivies' },
  { value: 'name', label: 'Nom A-Z' },
];

export default function AgenciesListingPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('Toutes');
  const [minRating, setMinRating] = useState(0);
  const [selectedType, setSelectedType] = useState('all');
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadAgencies();
  }, []);

  const loadAgencies = async () => {
    try {
      const data = await agencyService.getAllAgencies();
      setAgencies(data);
    } catch (error) {
      console.error('Error loading agencies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort agencies
  const filteredAgencies = agencies
    .filter((agency) => {
      // Search filter
      const matchesSearch =
        agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agency.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agency.description.toLowerCase().includes(searchTerm.toLowerCase());

      // City filter
      const matchesCity = selectedCity === 'Toutes' || agency.city === selectedCity;

      // Rating filter
      const matchesRating = agency.rating >= minRating;

      // Type filter
      const matchesType = selectedType === 'all' || agency.type === selectedType;

      // Open filter
      const matchesOpen = !showOpenOnly || agency.isOpen;

      return matchesSearch && matchesCity && matchesRating && matchesType && matchesOpen;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'followers':
          return b.followerCount - a.followerCount;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('Toutes');
    setMinRating(0);
    setSelectedType('all');
    setShowOpenOnly(false);
    setSortBy('rating');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos Agences</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Trouvez l&apos;agence la plus proche de vous pour vos besoins de location de véhicules.
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
                  placeholder="Rechercher une agence par nom ou ville..."
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

              {/* City Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Ville</h3>
                <div className="space-y-2">
                  {cities.map((city) => (
                    <label
                      key={city}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="city"
                        checked={selectedCity === city}
                        onChange={() => setSelectedCity(city)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{city}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Note minimum</h3>
                <div className="space-y-2">
                  {ratingOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === option.value}
                        onChange={() => setMinRating(option.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Type d&apos;agence</h3>
                <div className="space-y-2">
                  {typeOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="type"
                        checked={selectedType === option.value}
                        onChange={() => setSelectedType(option.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Open Now Toggle */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      showOpenOnly ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    onClick={() => setShowOpenOnly(!showOpenOnly)}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        showOpenOnly ? 'left-7' : 'left-1'
                      }`}
                    />
                  </div>
                  <span className="text-gray-700">Ouvert maintenant</span>
                </label>
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
                <h2 className="text-xl font-bold text-gray-900">Nos agences</h2>
                <p className="text-gray-600">
                  {filteredAgencies.length} agence(s) trouvée(s)
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
                    className="bg-gray-200 rounded-xl h-72 animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* Agencies Grid */}
            {!loading && filteredAgencies.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAgencies.map((agency) => (
                  <AgencyCard key={agency.id} agency={agency} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && filteredAgencies.length === 0 && (
              <NoElementFound
                element="agence"
                icon={Building2}
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

              {/* City Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Ville</h3>
                <div className="space-y-2">
                  {cities.map((city) => (
                    <label key={city} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="cityMobile"
                        checked={selectedCity === city}
                        onChange={() => setSelectedCity(city)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{city}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Note minimum</h3>
                <div className="space-y-2">
                  {ratingOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="ratingMobile"
                        checked={minRating === option.value}
                        onChange={() => setMinRating(option.value)}
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
