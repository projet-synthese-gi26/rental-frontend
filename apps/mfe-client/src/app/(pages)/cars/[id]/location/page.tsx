'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Check,
    MapPin,
    Calendar,
    Clock,
    User,
    CreditCard,
    ChevronDown,
    AlertCircle,
    Smartphone,
} from 'lucide-react';
import { ApiVehicle, ApiDriver, VehiclePricing } from '@/types/apiVehicleType';
import { catalogService } from '@/services/catalogService';

// Cameroon cities
const cameroonCities = [
    'Yaounde', 'Douala', 'Bafoussam', 'Bamenda', 'Garoua',
    'Maroua', 'Kribi', 'Limbe', 'Bertoua', 'Ebolowa',
];

// Payment methods
const paymentMethods = [
    { id: 'momo', name: 'Mobile Money', color: 'bg-yellow-400' },
    { id: 'om', name: 'Orange Money', color: 'bg-orange-500' },
];

type BookingStep = 1 | 2 | 3 | 4 | 5;

interface BookingFormData {
    pickupCity: string;
    pickupDate: string;
    pickupTime: string;
    dropoffCity: string;
    dropoffDate: string;
    dropoffTime: string;
    sameLocation: boolean;
    needDriver: boolean;
    selectedDriver: ApiDriver | null;
    paymentMethod: string;
    agreeTerms: boolean;
    agreePrivacy: boolean;
    confirmDetails: boolean;
}

export default function BookingPage() {
    const params = useParams();
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState<BookingStep>(1);
    const [vehicle, setVehicle] = useState<ApiVehicle | null>(null);
    const [pricing, setPricing] = useState<VehiclePricing | null>(null);
    const [drivers, setDrivers] = useState<ApiDriver[]>([]);
    const [driversLoading, setDriversLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<BookingFormData>({
        pickupCity: '',
        pickupDate: '',
        pickupTime: '09:00',
        dropoffCity: '',
        dropoffDate: '',
        dropoffTime: '18:00',
        sameLocation: true,
        needDriver: false,
        selectedDriver: null,
        paymentMethod: '',
        agreeTerms: false,
        agreePrivacy: false,
        confirmDetails: false,
    });

    useEffect(() => {
        const loadVehicle = async () => {
            setLoading(true);
            try {
                const id = params.id as string;
                const details = await catalogService.getVehicleDetails(id);
                setVehicle(details.vehicle);
                setPricing(details.pricing ?? details.vehicle.pricing ?? null);
            } catch (err) {
                console.error('Error loading vehicle:', err);
                setError('Impossible de charger les donnees.');
            } finally {
                setLoading(false);
            }
        };
        loadVehicle();
    }, [params.id]);

    // Load available drivers when entering step 3 (requires agencyId + dates)
    useEffect(() => {
        if (currentStep !== 3 || !vehicle || !formData.pickupDate || !formData.dropoffDate) return;

        const loadDrivers = async () => {
            setDriversLoading(true);
            try {
                const startISO = new Date(formData.pickupDate).toISOString();
                const endISO = new Date(formData.dropoffDate).toISOString();
                const data = await catalogService.getAvailableDrivers(vehicle.agencyId, startISO, endISO);
                setDrivers(data);
            } catch (err) {
                console.error('Error loading drivers:', err);
                setDrivers([]);
            } finally {
                setDriversLoading(false);
            }
        };
        loadDrivers();
    }, [currentStep, vehicle, formData.pickupDate, formData.dropoffDate]);

    const vehicleName = vehicle ? `${vehicle.brand} ${vehicle.model}` : '';
    const currency = pricing?.currency ?? 'XAF';
    const pricePerDay = pricing?.pricePerDay ?? 0;

    const calculateDays = () => {
        if (formData.pickupDate && formData.dropoffDate) {
            const start = new Date(formData.pickupDate);
            const end = new Date(formData.dropoffDate);
            return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
        }
        return 1;
    };

    const calculateTotal = () => {
        const days = calculateDays();
        const vehicleCost = pricePerDay * days;
        const driverCost = formData.selectedDriver?.pricing ? formData.selectedDriver.pricing.pricePerDay * days : 0;
        const taxRate = 0.1;
        const subtotal = vehicleCost + driverCost;
        const taxes = subtotal * taxRate;
        return { vehicleCost, driverCost, taxes, total: subtotal + taxes, days };
    };

    const updateFormData = (updates: Partial<BookingFormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return formData.pickupCity && formData.pickupDate && formData.pickupTime;
            case 2:
                return (formData.sameLocation || formData.dropoffCity) && formData.dropoffDate && formData.dropoffTime;
            case 3:
                return !formData.needDriver || formData.selectedDriver !== null;
            case 4:
                return formData.paymentMethod && formData.agreeTerms && formData.agreePrivacy && formData.confirmDetails;
            case 5:
                return true;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (currentStep < 5 && canProceed()) {
            setCurrentStep((prev) => (prev + 1) as BookingStep);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as BookingStep);
        }
    };

    const handleConfirmBooking = async () => {
        console.log('Booking confirmed:', { vehicle, formData, total: calculateTotal() });
        // TODO: POST to booking API
        alert('Reservation confirmee !');
        router.push('/cars');
    };

    const costs = calculateTotal();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
            </div>
        );
    }

    if (error || !vehicle) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Vehicule non trouve'}</h1>
                    <Link href="/cars" className="text-blue-600 hover:underline">
                        Retour a la liste des vehicules
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <Link
                    href={`/cars/${vehicle.id}`}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
                >
                    <ArrowLeft size={20} />
                    <span>Retour au vehicule</span>
                </Link>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {[1, 2, 3, 4, 5].map((step) => (
                            <div key={step} className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                        step < currentStep
                                            ? 'bg-green-500 text-white'
                                            : step === currentStep
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-500'
                                    }`}
                                >
                                    {step < currentStep ? <Check size={20} /> : step}
                                </div>
                                {step < 5 && (
                                    <div
                                        className={`h-1 mx-2 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`}
                                        style={{ width: '60px' }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-gray-600">
                        Etape {currentStep} sur 5 -{' '}
                        {currentStep === 1 && 'Lieu de prise en charge'}
                        {currentStep === 2 && 'Lieu de retour'}
                        {currentStep === 3 && 'Choix du chauffeur'}
                        {currentStep === 4 && 'Paiement'}
                        {currentStep === 5 && 'Confirmation'}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            {/* Step 1: Pickup Location */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <MapPin className="text-blue-600" />
                                        Lieu de prise en charge
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value="Cameroun"
                                                    disabled
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                                            <div className="relative">
                                                <select
                                                    value={formData.pickupCity}
                                                    onChange={(e) => updateFormData({ pickupCity: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Selectionner une ville</option>
                                                    {cameroonCities.map((city) => (
                                                        <option key={city} value={city}>{city}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date de prise en charge</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="date"
                                                    value={formData.pickupDate}
                                                    onChange={(e) => updateFormData({ pickupDate: e.target.value })}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Heure de prise en charge</label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="time"
                                                    value={formData.pickupTime}
                                                    onChange={(e) => updateFormData({ pickupTime: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Dropoff Location */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <MapPin className="text-blue-600" />
                                        Lieu de retour
                                    </h2>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.sameLocation}
                                            onChange={(e) => {
                                                updateFormData({
                                                    sameLocation: e.target.checked,
                                                    dropoffCity: e.target.checked ? formData.pickupCity : '',
                                                });
                                            }}
                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-gray-700">Retourner au meme endroit</span>
                                    </label>

                                    {!formData.sameLocation && (
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                                                <input
                                                    type="text"
                                                    value="Cameroun"
                                                    disabled
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                                                <div className="relative">
                                                    <select
                                                        value={formData.dropoffCity}
                                                        onChange={(e) => updateFormData({ dropoffCity: e.target.value })}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">Selectionner une ville</option>
                                                        {cameroonCities.map((city) => (
                                                            <option key={city} value={city}>{city}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date de retour</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="date"
                                                    value={formData.dropoffDate}
                                                    onChange={(e) => updateFormData({ dropoffDate: e.target.value })}
                                                    min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Heure de retour</label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="time"
                                                    value={formData.dropoffTime}
                                                    onChange={(e) => updateFormData({ dropoffTime: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {formData.pickupDate && formData.dropoffDate && (
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-blue-800">
                                                <strong>Duree de location:</strong> {calculateDays()} jour(s)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 3: Driver Selection */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <User className="text-blue-600" />
                                        Choix du chauffeur
                                    </h2>

                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="driverOption"
                                                checked={!formData.needDriver}
                                                onChange={() => updateFormData({ needDriver: false, selectedDriver: null })}
                                                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="font-medium text-gray-900">Je conduis moi-meme</span>
                                        </label>

                                        <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="driverOption"
                                                checked={formData.needDriver}
                                                onChange={() => updateFormData({ needDriver: true })}
                                                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="font-medium text-gray-900">Je souhaite un chauffeur</span>
                                        </label>
                                    </div>

                                    {formData.needDriver && (
                                        <div className="space-y-4 mt-6">
                                            <h3 className="font-semibold text-gray-900">Selectionnez un chauffeur</h3>

                                            {driversLoading && (
                                                <div className="flex items-center justify-center py-8">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
                                                </div>
                                            )}

                                            {!driversLoading && drivers.length === 0 && (
                                                <p className="text-gray-500 text-center py-8">Aucun chauffeur disponible pour cette periode.</p>
                                            )}

                                            {!driversLoading && drivers.length > 0 && (
                                                <div className="grid gap-4">
                                                    {drivers.map((driver) => {
                                                        const driverName = `${driver.firstname} ${driver.lastname}`;
                                                        const driverPricePerDay = driver.pricing?.pricePerDay ?? 0;
                                                        const driverCurrency = driver.pricing?.currency ?? currency;

                                                        return (
                                                            <div
                                                                key={driver.id}
                                                                onClick={() => updateFormData({ selectedDriver: driver })}
                                                                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                                                    formData.selectedDriver?.id === driver.id
                                                                        ? 'border-blue-600 bg-blue-50'
                                                                        : 'hover:border-gray-400'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                                                        {driver.profilUrl ? (
                                                                            <img src={driver.profilUrl} alt={driverName} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-bold">
                                                                                {driver.firstname.charAt(0)}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h4 className="font-bold text-gray-900">{driverName}</h4>
                                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                            <span>{driver.age} ans</span>
                                                                            <span>- {driver.tel}</span>
                                                                        </div>
                                                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                                                                            driver.status === 'AVAILABLE'
                                                                                ? 'bg-green-100 text-green-700'
                                                                                : 'bg-gray-100 text-gray-600'
                                                                        }`}>
                                                                            {driver.status}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-lg font-bold text-blue-600">
                                                                            {driverPricePerDay.toLocaleString()} {driverCurrency}
                                                                        </p>
                                                                        <p className="text-sm text-gray-500">/jour</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 4: Payment */}
                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <CreditCard className="text-blue-600" />
                                        Methode de paiement
                                    </h2>

                                    <div className="grid grid-cols-2 gap-4">
                                        {paymentMethods.map((method) => (
                                            <div
                                                key={method.id}
                                                onClick={() => updateFormData({ paymentMethod: method.id })}
                                                className={`p-4 border rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                                                    formData.paymentMethod === method.id
                                                        ? 'border-blue-600 bg-blue-50'
                                                        : 'hover:border-gray-400'
                                                }`}
                                            >
                                                <div className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center`}>
                                                    <Smartphone className="text-white" size={24} />
                                                </div>
                                                <span className="font-medium">{method.name}</span>
                                                {formData.paymentMethod === method.id && (
                                                    <Check className="ml-auto text-blue-600" size={20} />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4 pt-6 border-t">
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.agreeTerms}
                                                onChange={(e) => updateFormData({ agreeTerms: e.target.checked })}
                                                className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700">
                                                J&apos;accepte les conditions generales de location
                                            </span>
                                        </label>

                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.agreePrivacy}
                                                onChange={(e) => updateFormData({ agreePrivacy: e.target.checked })}
                                                className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700">
                                                J&apos;accepte la politique de confidentialite
                                            </span>
                                        </label>

                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.confirmDetails}
                                                onChange={(e) => updateFormData({ confirmDetails: e.target.checked })}
                                                className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700">
                                                Je confirme que les details de la reservation sont corrects
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Review & Confirmation */}
                            {currentStep === 5 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <Check className="text-blue-600" />
                                        Recapitulatif de votre reservation
                                    </h2>

                                    {/* Vehicle Summary */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3">Vehicule</h3>
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-200">
                                                <img
                                                    src={vehicle.images?.[0] || 'https://via.placeholder.com/96x64/e2e8f0/64748b?text=No+Image'}
                                                    alt={vehicleName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{vehicleName}</p>
                                                <p className="text-gray-600">{vehicle.transmission} - {vehicle.color}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rental Period */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3">Periode de location</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Prise en charge</p>
                                                <p className="font-medium">{formData.pickupCity}, Cameroun</p>
                                                <p className="text-gray-600">{formData.pickupDate} a {formData.pickupTime}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Retour</p>
                                                <p className="font-medium">
                                                    {formData.sameLocation ? formData.pickupCity : formData.dropoffCity}, Cameroun
                                                </p>
                                                <p className="text-gray-600">{formData.dropoffDate} a {formData.dropoffTime}</p>
                                            </div>
                                        </div>
                                        <p className="text-blue-600 font-semibold mt-2">Duree: {costs.days} jour(s)</p>
                                    </div>

                                    {/* Driver */}
                                    {formData.selectedDriver && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="font-semibold text-gray-900 mb-3">Chauffeur</h3>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                                                    {formData.selectedDriver.profilUrl ? (
                                                        <img src={formData.selectedDriver.profilUrl} alt={formData.selectedDriver.firstname} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                                                            {formData.selectedDriver.firstname.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{formData.selectedDriver.firstname} {formData.selectedDriver.lastname}</p>
                                                    <p className="text-sm text-gray-500">{formData.selectedDriver.tel}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Payment Method */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3">Methode de paiement</h3>
                                        <p className="font-medium">
                                            {paymentMethods.find((m) => m.id === formData.paymentMethod)?.name || 'Non selectionne'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8 pt-6 border-t">
                                {currentStep > 1 ? (
                                    <button
                                        onClick={handleBack}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                                    >
                                        Retour
                                    </button>
                                ) : (
                                    <div />
                                )}

                                {currentStep < 5 ? (
                                    <button
                                        onClick={handleNext}
                                        disabled={!canProceed()}
                                        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        Suivant
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleConfirmBooking}
                                        className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                                    >
                                        Confirmer la reservation
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Booking Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4">Recapitulatif</h3>

                            {/* Vehicle */}
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                                <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-200">
                                    <img
                                        src={vehicle.images?.[0] || 'https://via.placeholder.com/80x56/e2e8f0/64748b?text=No+Image'}
                                        alt={vehicleName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{vehicleName}</p>
                                    <p className="text-sm text-gray-500">{vehicle.transmission}</p>
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="mb-4">
                                <p className="text-gray-600 mb-1">Duree de location</p>
                                <p className="font-bold text-lg">{costs.days} jour(s)</p>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6 pb-6 border-b">
                                <div className="flex justify-between text-gray-600">
                                    <span>Vehicule ({costs.days} jours)</span>
                                    <span>{costs.vehicleCost.toLocaleString()} {currency}</span>
                                </div>
                                {formData.selectedDriver && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Chauffeur ({costs.days} jours)</span>
                                        <span>{costs.driverCost.toLocaleString()} {currency}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>Taxes et frais</span>
                                    <span>{costs.taxes.toLocaleString()} {currency}</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-bold text-blue-600">
                                    {costs.total.toLocaleString()} {currency}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
