'use client';
import React, { useState, useEffect } from 'react';
import { Car, ChevronDown } from 'lucide-react';
import { ApiVehicle, VehicleCategory } from '@/types/apiVehicleType';
import { catalogService } from '@/services/catalogService';
import { CarsHero, CarsFilterSidebar, ApiVehicleCard, Pagination } from '@/components/cars';

const sortOptions = [
    { value: 'name', label: 'Nom A-Z', labelEn: 'Name A-Z' },
    { value: 'year', label: 'Plus récent', labelEn: 'Newest' },
    { value: 'price_asc', label: 'Prix croissant', labelEn: 'Price: Low to High' },
    { value: 'price_desc', label: 'Prix décroissant', labelEn: 'Price: High to Low' },
];

const ITEMS_PER_PAGE = 15;

export default function CarsListingPage() {
    const [lang] = useState<'FR' | 'EN'>('FR');

    const [vehicles, setVehicles] = useState<ApiVehicle[]>([]);
    const [categories, setCategories] = useState<VehicleCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [minPassengers, setMinPassengers] = useState(0);
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: Infinity });
    const [sortBy, setSortBy] = useState('name');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadVehicles();
        loadCategories();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, minPassengers, priceRange, sortBy]);

    const loadCategories = async () => {
        setCategoriesLoading(true);
        try {
            const data = await catalogService.getAllCategories();
            setCategories(data);
        } catch (err) {
            console.error('Error loading categories:', err);
        } finally {
            setCategoriesLoading(false);
        }
    };

    const loadVehicles = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await catalogService.getAvailableVehicles();
            setVehicles(data);
        } catch (err) {
            console.error('Error loading vehicles:', err);
            setError('Impossible de charger les véhicules. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const getCategoryName = (categoryId: string) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Unknown';
    };

    const filteredVehicles = vehicles
        .filter((vehicle) => {
            const vehicleName = `${vehicle.brand} ${vehicle.model}`;
            const matchesSearch =
                vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                getCategoryName(vehicle.categoryId).toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || vehicle.categoryId === selectedCategory;
            const matchesPassengers = minPassengers === 0 || vehicle.places >= minPassengers;
            const vehiclePrice = vehicle.pricing?.pricePerDay ?? 0;
            const matchesPrice = priceRange.max === Infinity && priceRange.min === 0
                ? true
                : vehiclePrice >= priceRange.min && vehiclePrice <= priceRange.max;
            return matchesSearch && matchesCategory && matchesPassengers && matchesPrice;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
                case 'year':
                    return new Date(b.yearProduction).getTime() - new Date(a.yearProduction).getTime();
                case 'price_asc':
                    return (a.pricing?.pricePerDay ?? 0) - (b.pricing?.pricePerDay ?? 0);
                case 'price_desc':
                    return (b.pricing?.pricePerDay ?? 0) - (a.pricing?.pricePerDay ?? 0);
                default:
                    return 0;
            }
        });

    const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setMinPassengers(0);
        setPriceRange({ min: 0, max: Infinity });
        setSortBy('name');
        setCurrentPage(1);
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <CarsHero lang={lang} searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <CarsFilterSidebar
                        lang={lang}
                        categories={categories}
                        categoriesLoading={categoriesLoading}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        minPassengers={minPassengers}
                        onPassengersChange={setMinPassengers}
                        priceRange={priceRange}
                        onPriceRangeChange={setPriceRange}
                        onClearFilters={clearFilters}
                        showMobileFilters={showFilters}
                        onOpenMobileFilters={() => setShowFilters(true)}
                        onCloseMobileFilters={() => setShowFilters(false)}
                    />

                    <main className="flex-1">
                        {/* Results Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {lang === 'FR' ? 'Nos véhicules' : 'Our vehicles'}
                                </h2>
                                <p className="text-slate-500 text-sm font-medium tracking-wide">
                                    {filteredVehicles.length} {lang === 'FR' ? 'véhicule(s) disponible(s)' : 'vehicle(s) available'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-500 text-xs font-semibold">
                                    {lang === 'FR' ? 'Trier par:' : 'Sort by:'}
                                </span>
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-900 dark:text-white"
                                    >
                                        {sortOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {lang === 'FR' ? option.label : option.labelEn}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Error State */}
                        {error && (
                            <div className="text-center py-12">
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 max-w-md mx-auto">
                                    <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                                    <button onClick={loadVehicles} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all">
                                        {lang === 'FR' ? 'Réessayer' : 'Retry'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] h-96 animate-pulse" />
                                ))}
                            </div>
                        )}

                        {/* Vehicles Grid */}
                        {!loading && !error && paginatedVehicles.length > 0 && (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {paginatedVehicles.map((vehicle) => (
                                        <ApiVehicleCard key={vehicle.id} vehicle={vehicle} categoryName={getCategoryName(vehicle.categoryId)} lang={lang} />
                                    ))}
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    startIndex={startIndex}
                                    endIndex={endIndex}
                                    totalItems={filteredVehicles.length}
                                    lang={lang}
                                    onPageChange={goToPage}
                                />
                            </>
                        )}

                        {/* No Results */}
                        {!loading && !error && filteredVehicles.length === 0 && (
                            <div className="text-center py-20">
                                <Car size={64} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                                    {lang === 'FR' ? 'Aucun véhicule trouvé' : 'No vehicles found'}
                                </h3>
                                <p className="text-slate-500 mb-6">
                                    {lang === 'FR' ? 'Essayez de modifier vos filtres' : 'Try adjusting your filters'}
                                </p>
                                <button onClick={clearFilters} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all">
                                    {lang === 'FR' ? 'Réinitialiser les filtres' : 'Reset filters'}
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}
