'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Users,
    Fuel,
    Settings2,
    Heart,
    Share2,
    Calendar,
    Wind,
    Navigation,
    Bluetooth,
    Star,
    StarHalf,
    ChevronLeft,
    ChevronRight,
    X,
    Gauge,
    Palette,
} from 'lucide-react';
import { ApiVehicle, VehiclePricing, VehicleReview } from '@/types/apiVehicleType';
import { catalogService } from '@/services/catalogService';

// ---------------------------------------------------------------------------
// ImageGallery (local component)
// ---------------------------------------------------------------------------

interface ImageGalleryProps {
    images: string[];
    alt: string;
}

function ImageGallery({ images, alt }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    if (images.length === 0) {
        return (
            <div className="relative h-96 bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-gray-500">Aucune image disponible</span>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                <div
                    className="relative h-96 rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => setIsFullscreen(true)}
                >
                    <img
                        src={images[currentIndex]}
                        alt={`${alt} - Image ${currentIndex + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/600x400/e2e8f0/64748b?text=No+Image';
                        }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                            >
                                <ChevronLeft size={24} className="text-gray-800" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                            >
                                <ChevronRight size={24} className="text-gray-800" />
                            </button>
                        </>
                    )}

                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>

                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden ${
                                    index === currentIndex ? 'ring-2 ring-blue-600' : 'opacity-70 hover:opacity-100'
                                }`}
                            >
                                <img
                                    src={image}
                                    alt={`${alt} - Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/80x80/e2e8f0/64748b?text=No+Image';
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {isFullscreen && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
                    onClick={() => setIsFullscreen(false)}
                >
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300"
                    >
                        <X size={32} />
                    </button>

                    <div
                        className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={images[currentIndex]}
                            alt={`${alt} - Image ${currentIndex + 1}`}
                            className="w-full h-full object-contain"
                        />

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={goToPrevious}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full transition-colors"
                                >
                                    <ChevronLeft size={32} className="text-white" />
                                </button>
                                <button
                                    onClick={goToNext}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full transition-colors"
                                >
                                    <ChevronRight size={32} className="text-white" />
                                </button>
                            </>
                        )}

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// ---------------------------------------------------------------------------
// StarRating (local component)
// ---------------------------------------------------------------------------

function StarRating({ rating, maxRating = 5, size = 16, showValue = false, reviewCount }: {
    rating: number; maxRating?: number; size?: number; showValue?: boolean; reviewCount?: number;
}) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-1">
            <div className="flex">
                {Array.from({ length: fullStars }).map((_, i) => (
                    <Star key={`full-${i}`} size={size} className="text-yellow-400 fill-yellow-400" />
                ))}
                {hasHalfStar && <StarHalf size={size} className="text-yellow-400 fill-yellow-400" />}
                {Array.from({ length: emptyStars }).map((_, i) => (
                    <Star key={`empty-${i}`} size={size} className="text-gray-300" />
                ))}
            </div>
            {showValue && <span className="text-sm font-medium text-gray-700 ml-1">{rating.toFixed(1)}</span>}
            {reviewCount !== undefined && <span className="text-sm text-gray-500">({reviewCount} avis)</span>}
        </div>
    );
}

// ---------------------------------------------------------------------------
// TestimonialCard (local component)
// ---------------------------------------------------------------------------

function TestimonialCard({ name, photo, rating, comment, date }: {
    name: string; photo?: string; rating: number; comment: string; date?: string;
}) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {photo ? (
                        <img src={photo} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-bold">
                            {name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{name}</h4>
                    <StarRating rating={rating} size={14} />
                </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">&quot;{comment}&quot;</p>
            {date && (
                <p className="text-gray-400 text-xs">
                    {new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const functionalityLabels: Record<string, string> = {
    air_condition: 'Climatisation',
    usb_input: 'Port USB',
    seat_belt: 'Ceinture de sécurité',
    audio_input: 'Entrée audio',
    child_seat: 'Siège enfant',
    bluetooth: 'Bluetooth',
    sleeping_bed: 'Lit de couchage',
    onboard_computer: 'Ordinateur de bord',
    gps: 'GPS',
    luggage: 'Espace bagages',
    water: 'Eau',
    additional_covers: 'Couvertures supplémentaires',
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function CarDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const [vehicle, setVehicle] = useState<ApiVehicle | null>(null);
    const [pricing, setPricing] = useState<VehiclePricing | null>(null);
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState<VehicleReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedPriceType, setSelectedPriceType] = useState<'hour' | 'day'>('day');
    const [isFavorite, setIsFavorite] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const loadVehicle = async () => {
            setLoading(true);
            setError('');
            try {
                const id = params.id as string;
                const data = await catalogService.getVehicleDetails(id);
                setVehicle(data.vehicle);
                setPricing(data.pricing ?? data.vehicle.pricing ?? null);
                setRating(data.rating);
                setReviews(data.reviews ?? []);
            } catch (err) {
                console.error('Error loading vehicle:', err);
                setError('Impossible de charger les détails du véhicule.');
            } finally {
                setLoading(false);
            }
        };
        loadVehicle();
    }, [params.id]);

    const vehicleName = vehicle ? `${vehicle.brand} ${vehicle.model}` : '';
    const currency = pricing?.currency ?? 'XAF';
    const pricePerDay = pricing?.pricePerDay ?? 0;
    const pricePerHour = pricing?.pricePerHour ?? 0;

    const getPriceDisplay = () => {
        switch (selectedPriceType) {
            case 'hour':
                return pricePerHour;
            default:
                return pricePerDay;
        }
    };

    const bookingDays =
        startDate && endDate
            ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)))
            : 0;

    const specifications = vehicle
        ? [
            { icon: Users, label: 'Passagers', value: `${vehicle.places} places` },
            { icon: Settings2, label: 'Transmission', value: vehicle.transmission },
            { icon: Fuel, label: 'Moteur', value: vehicle.engineDetails?.type || 'N/A' },
            { icon: Gauge, label: 'Puissance', value: vehicle.engineDetails?.horsepower ? `${vehicle.engineDetails.horsepower} ch` : 'N/A' },
            { icon: Palette, label: 'Couleur', value: vehicle.color },
            { icon: Wind, label: 'Climatisation', value: vehicle.functionalities?.air_condition ? 'Oui' : 'Non' },
            { icon: Navigation, label: 'GPS', value: vehicle.functionalities?.gps ? 'Inclus' : 'Non' },
            { icon: Bluetooth, label: 'Bluetooth', value: vehicle.functionalities?.bluetooth ? 'Oui' : 'Non' },
        ]
        : [];

    const activeFeatures = vehicle
        ? Object.entries(vehicle.functionalities ?? {})
            .filter(([, enabled]) => enabled)
            .map(([key]) => functionalityLabels[key] ?? key)
        : [];

    // Loading state
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

    // Error state
    if (error || !vehicle) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        {error || 'Vehicule non trouve'}
                    </h1>
                    <Link href="/cars" className="text-blue-600 hover:underline">
                        Retour a la liste des vehicules
                    </Link>
                </div>
            </div>
        );
    }

    const images = vehicle.images?.length ? vehicle.images : [];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <Link
                    href="/cars"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
                >
                    <ArrowLeft size={20} />
                    <span>Retour aux vehicules</span>
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <ImageGallery images={images} alt={vehicleName} />

                        {/* Vehicle Info */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                <div>
                                    <span className={`inline-block px-3 py-1 text-sm rounded-full font-semibold mb-2 ${
                                        vehicle.statut === 'AVAILABLE'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {vehicle.statut}
                                    </span>
                                    <h1 className="text-3xl font-bold text-gray-900">{vehicleName}</h1>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {new Date(vehicle.yearProduction).getFullYear()} &middot; {vehicle.kilometrage.toLocaleString()} km
                                    </p>
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
                                <StarRating rating={rating} size={18} showValue reviewCount={reviews.length} />
                            </div>

                            {/* Price Tabs */}
                            {pricing && (
                                <div className="mb-6">
                                    <div className="flex gap-2 mb-4">
                                        {pricePerHour > 0 && (
                                            <button
                                                onClick={() => setSelectedPriceType('hour')}
                                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                                    selectedPriceType === 'hour'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                Heure
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setSelectedPriceType('day')}
                                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                                selectedPriceType === 'day'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Journee
                                        </button>
                                    </div>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {getPriceDisplay().toLocaleString()} {currency}
                                        <span className="text-gray-500 font-normal text-lg">
                                            /{selectedPriceType === 'hour' ? 'heure' : 'jour'}
                                        </span>
                                    </p>
                                </div>
                            )}

                            {/* Specifications */}
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Caracteristiques</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {specifications.map((spec, index) => (
                                        <div key={index} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                                            <spec.icon size={24} className="text-blue-600 mb-2" />
                                            <span className="text-sm text-gray-500">{spec.label}</span>
                                            <span className="font-semibold text-gray-900">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Fuel Efficiency */}
                            {vehicle.fuelEfficiency && (
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Consommation</h2>
                                    <div className="flex gap-6">
                                        <div className="bg-gray-50 rounded-lg p-4 flex-1 text-center">
                                            <p className="text-sm text-gray-500">Ville</p>
                                            <p className="font-semibold text-gray-900">{vehicle.fuelEfficiency.city}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4 flex-1 text-center">
                                            <p className="text-sm text-gray-500">Autoroute</p>
                                            <p className="font-semibold text-gray-900">{vehicle.fuelEfficiency.highway}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {vehicle.description && vehicle.description.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                                    <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
                                        {vehicle.description.map((line, i) => (
                                            <li key={i}>{line}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Features */}
                            {activeFeatures.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Equipements</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {activeFeatures.map((feature, index) => (
                                            <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Avis clients</h2>
                                <div className="flex items-center gap-2">
                                    <Star size={20} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-lg font-bold">{rating.toFixed(1)}</span>
                                    <span className="text-gray-500">({reviews.length} avis)</span>
                                </div>
                            </div>

                            {reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {reviews.map((review, index) => (
                                        <TestimonialCard
                                            key={review.id ?? index}
                                            name={review.name}
                                            photo={review.photo}
                                            rating={review.rating}
                                            comment={review.comment}
                                            date={review.date}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">Aucun avis pour le moment.</p>
                            )}
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Reserver ce vehicule</h2>

                            {/* Date Selection */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de debut</label>
                                    <div className="relative">
                                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                                    <div className="relative">
                                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                            {startDate && endDate && pricing && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <div className="flex justify-between text-gray-600 mb-2">
                                        <span>Prix par jour</span>
                                        <span>{pricePerDay.toLocaleString()} {currency}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 mb-2">
                                        <span>Duree</span>
                                        <span>{bookingDays} jour(s)</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 mb-2">
                                        <span>Taxes et frais</span>
                                        <span>Inclus</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2 mt-2">
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span className="text-blue-600">
                                                {(pricePerDay * bookingDays).toLocaleString()} {currency}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Book Button */}
                            <button
                                onClick={() => {
                                    if (vehicle && startDate && endDate) {
                                        router.push(`/cars/${vehicle.id}/location`);
                                    }
                                }}
                                disabled={!startDate || !endDate}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg transition-colors"
                            >
                                Reserver maintenant
                            </button>

                            <p className="text-center text-gray-500 text-sm mt-4">
                                Annulation gratuite sous 24h
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
