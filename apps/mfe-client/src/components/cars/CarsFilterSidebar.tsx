import React from 'react';
import { Filter, X } from 'lucide-react';
import { VehicleCategory } from '@/types/apiVehicleType';

const passengerOptions = [
    { value: 0, label: 'Tous', labelEn: 'All' },
    { value: 2, label: '2 places', labelEn: '2 seats' },
    { value: 4, label: '4 places', labelEn: '4 seats' },
    { value: 5, label: '5 places', labelEn: '5 seats' },
    { value: 7, label: '7+ places', labelEn: '7+ seats' },
];

const priceRangeOptions = [
    { min: 0, max: Infinity, label: 'Tous les prix', labelEn: 'All prices' },
    { min: 0, max: 5000, label: 'Moins de 5 000', labelEn: 'Under 5,000' },
    { min: 5000, max: 15000, label: '5 000 - 15 000', labelEn: '5,000 - 15,000' },
    { min: 15000, max: 30000, label: '15 000 - 30 000', labelEn: '15,000 - 30,000' },
    { min: 30000, max: Infinity, label: 'Plus de 30 000', labelEn: 'Over 30,000' },
];

interface CarsFilterSidebarProps {
    lang: 'FR' | 'EN';
    categories: VehicleCategory[];
    categoriesLoading: boolean;
    selectedCategory: string;
    onCategoryChange: (categoryId: string) => void;
    minPassengers: number;
    onPassengersChange: (value: number) => void;
    priceRange: { min: number; max: number };
    onPriceRangeChange: (range: { min: number; max: number }) => void;
    onClearFilters: () => void;
    showMobileFilters: boolean;
    onOpenMobileFilters: () => void;
    onCloseMobileFilters: () => void;
}

function FilterContent({
    lang,
    categories,
    categoriesLoading,
    selectedCategory,
    onCategoryChange,
    minPassengers,
    onPassengersChange,
    priceRange,
    onPriceRangeChange,
    radioNamePrefix,
}: {
    lang: 'FR' | 'EN';
    categories: VehicleCategory[];
    categoriesLoading: boolean;
    selectedCategory: string;
    onCategoryChange: (categoryId: string) => void;
    minPassengers: number;
    onPassengersChange: (value: number) => void;
    priceRange: { min: number; max: number };
    onPriceRangeChange: (range: { min: number; max: number }) => void;
    radioNamePrefix: string;
}) {
    return (
        <>
            {/* Categories */}
            <div className="mb-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm tracking-wide">
                    {lang === 'FR' ? 'Catégorie' : 'Category'}
                </h3>
                {categoriesLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name={`${radioNamePrefix}category`}
                                checked={selectedCategory === 'all'}
                                onChange={() => onCategoryChange('all')}
                                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                            />
                            <span className="text-slate-700 dark:text-slate-300 text-sm">
                                {lang === 'FR' ? 'Toutes les catégories' : 'All categories'}
                            </span>
                        </label>
                        {categories.map((category) => (
                            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name={`${radioNamePrefix}category`}
                                    checked={selectedCategory === category.id}
                                    onChange={() => onCategoryChange(category.id)}
                                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                />
                                <span className="text-slate-700 dark:text-slate-300 text-sm">
                                    {category.name}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm tracking-wide">
                    {lang === 'FR' ? 'Prix par jour' : 'Price per day'}
                </h3>
                <div className="space-y-2">
                    {priceRangeOptions.map((option, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name={`${radioNamePrefix}price`}
                                checked={priceRange.min === option.min && priceRange.max === option.max}
                                onChange={() => onPriceRangeChange({ min: option.min, max: option.max })}
                                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                            />
                            <span className="text-slate-700 dark:text-slate-300 text-sm">
                                {lang === 'FR' ? option.label : option.labelEn}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Passengers */}
            <div className="mb-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm tracking-wide">
                    {lang === 'FR' ? 'Capacité passagers' : 'Passenger Capacity'}
                </h3>
                <div className="space-y-2">
                    {passengerOptions.map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name={`${radioNamePrefix}passengers`}
                                checked={minPassengers === option.value}
                                onChange={() => onPassengersChange(option.value)}
                                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                            />
                            <span className="text-slate-700 dark:text-slate-300 text-sm">
                                {lang === 'FR' ? option.label : option.labelEn}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </>
    );
}

export default function CarsFilterSidebar({
    lang,
    categories,
    categoriesLoading,
    selectedCategory,
    onCategoryChange,
    minPassengers,
    onPassengersChange,
    priceRange,
    onPriceRangeChange,
    onClearFilters,
    showMobileFilters,
    onOpenMobileFilters,
    onCloseMobileFilters,
}: CarsFilterSidebarProps) {
    const sharedProps = {
        lang,
        categories,
        categoriesLoading,
        selectedCategory,
        onCategoryChange,
        minPassengers,
        onPassengersChange,
        priceRange,
        onPriceRangeChange,
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl p-6 sticky top-24 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                            {lang === 'FR' ? 'Filtres' : 'Filters'}
                        </h2>
                        <button onClick={onClearFilters} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                            {lang === 'FR' ? 'Réinitialiser' : 'Reset'}
                        </button>
                    </div>
                    <FilterContent {...sharedProps} radioNamePrefix="" />
                </div>
            </aside>

            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
                <button
                    onClick={onOpenMobileFilters}
                    className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 py-3 px-4 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 font-semibold text-sm text-slate-900 dark:text-white"
                >
                    <Filter size={16} />
                    <span>{lang === 'FR' ? 'Filtres' : 'Filters'}</span>
                </button>
            </div>

            {/* Mobile Filters Modal */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-[150] lg:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCloseMobileFilters} />
                    <div className="absolute inset-y-0 left-0 w-80 bg-white dark:bg-slate-900 shadow-xl overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                                    {lang === 'FR' ? 'Filtres' : 'Filters'}
                                </h2>
                                <button onClick={onCloseMobileFilters}>
                                    <X size={24} className="text-slate-500" />
                                </button>
                            </div>

                            <FilterContent {...sharedProps} radioNamePrefix="mobile-" />

                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={onClearFilters}
                                    className="flex-1 py-3 border border-slate-300 dark:border-slate-600 rounded-xl font-semibold text-slate-700 dark:text-slate-300"
                                >
                                    {lang === 'FR' ? 'Réinitialiser' : 'Reset'}
                                </button>
                                <button
                                    onClick={onCloseMobileFilters}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold"
                                >
                                    {lang === 'FR' ? 'Appliquer' : 'Apply'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
