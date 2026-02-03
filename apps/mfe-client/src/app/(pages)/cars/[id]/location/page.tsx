'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
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
  Star,
  AlertCircle,
} from 'lucide-react';
import { useReservationStore } from '@/store/workflow.store';
import { vehicleService } from '@/services/vehicleService';
import { driverService } from '@/services/driverService';
import { Vehicle } from '@/types/vehicleType';
import { Driver } from '@/types/driverType';
import { StarRating } from '@/components/StarRating';

// Countries for selection
const countries = [
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬' },
];

// Cities by country
const citiesByCountry: Record<string, string[]> = {
  CM: ['Yaoundé', 'Douala', 'Bafoussam', 'Bamenda', 'Garoua', 'Maroua', 'Kribi', 'Limbe'],
  NG: ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan'],
  GA: ['Libreville', 'Port-Gentil', 'Franceville'],
  CG: ['Brazzaville', 'Pointe-Noire'],
};

// Payment methods
const paymentMethods = [
  { id: 'paypal', name: 'PayPal', icon: '/client/images/payment/paypal.png' },
  { id: 'bitcoin', name: 'Bitcoin', icon: '/client/images/payment/bitcoin.png' },
  { id: 'momo', name: 'Mobile Money', icon: '/client/images/payment/momo.png' },
  { id: 'om', name: 'Orange Money', icon: '/client/images/payment/om.png' },
];

type BookingStep = 1 | 2 | 3 | 4 | 5;

interface BookingFormData {
  pickupCountry: string;
  pickupCity: string;
  pickupDate: string;
  pickupTime: string;
  dropoffCountry: string;
  dropoffCity: string;
  dropoffDate: string;
  dropoffTime: string;
  sameLocation: boolean;
  needDriver: boolean;
  selectedDriver: Driver | null;
  paymentMethod: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  confirmDetails: boolean;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { vehicle: storeVehicle, bookingDates, driver: storeDriver } = useReservationStore();

  const [currentStep, setCurrentStep] = useState<BookingStep>(1);
  const [vehicle, setVehicle] = useState<Vehicle | null>(storeVehicle);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<BookingFormData>({
    pickupCountry: 'CM',
    pickupCity: '',
    pickupDate: bookingDates.start || '',
    pickupTime: '09:00',
    dropoffCountry: 'CM',
    dropoffCity: '',
    dropoffDate: bookingDates.end || '',
    dropoffTime: '18:00',
    sameLocation: true,
    needDriver: false,
    selectedDriver: storeDriver,
    paymentMethod: '',
    agreeTerms: false,
    agreePrivacy: false,
    confirmDetails: false,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load vehicle if not in store
        if (!vehicle) {
          const id = Number(params.id);
          const vehicleData = await vehicleService.getVehicleById(id);
          setVehicle(vehicleData || null);
        }
        // Load drivers
        const driversData = await driverService.getAllAvailableDrivers();
        setDrivers(driversData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params.id, vehicle]);

  const calculateDays = () => {
    if (formData.pickupDate && formData.dropoffDate) {
      const start = new Date(formData.pickupDate);
      const end = new Date(formData.dropoffDate);
      return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
    }
    return bookingDates.days || 1;
  };

  const calculateTotal = () => {
    const days = calculateDays();
    if (!vehicle) {
      return { vehicleCost: 0, driverCost: 0, taxes: 0, total: 0, days };
    }
    const vehicleCost = vehicle.pricePerDay * days;
    const driverCost = formData.selectedDriver ? formData.selectedDriver.pricePerDay * days : 0;
    const taxRate = 0.1; // 10% tax
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
        return formData.pickupCountry && formData.pickupCity && formData.pickupDate && formData.pickupTime;
      case 2:
        return formData.dropoffCountry && formData.dropoffCity && formData.dropoffDate && formData.dropoffTime;
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
    // Here you would call the API to create the booking
    // POST /api/bookings with the booking data
    console.log('Booking confirmed:', { vehicle, formData, total: calculateTotal() });
    router.push('/rental-process/confirmation');
  };

  const costs = calculateTotal();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Véhicule non trouvé</h1>
          <Link href="/cars" className="text-blue-600 hover:underline">
            Retour à la liste des véhicules
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
          <span>Retour au véhicule</span>
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
                    className={`w-full h-1 mx-2 ${
                      step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    style={{ width: '60px' }}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600">
            Étape {currentStep} sur 5 -{' '}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pays
                      </label>
                      <div className="relative">
                        <select
                          value={formData.pickupCountry}
                          onChange={(e) => {
                            updateFormData({ pickupCountry: e.target.value, pickupCity: '' });
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500"
                        >
                          {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ville/Région
                      </label>
                      <div className="relative">
                        <select
                          value={formData.pickupCity}
                          onChange={(e) => updateFormData({ pickupCity: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Sélectionner une ville</option>
                          {citiesByCountry[formData.pickupCountry]?.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de prise en charge
                      </label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Heure de prise en charge
                      </label>
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
                          dropoffCountry: e.target.checked ? formData.pickupCountry : formData.dropoffCountry,
                          dropoffCity: e.target.checked ? formData.pickupCity : formData.dropoffCity,
                        });
                      }}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Retourner au même endroit</span>
                  </label>

                  {!formData.sameLocation && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pays
                        </label>
                        <div className="relative">
                          <select
                            value={formData.dropoffCountry}
                            onChange={(e) => {
                              updateFormData({ dropoffCountry: e.target.value, dropoffCity: '' });
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500"
                          >
                            {countries.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.flag} {country.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ville/Région
                        </label>
                        <div className="relative">
                          <select
                            value={formData.dropoffCity}
                            onChange={(e) => updateFormData({ dropoffCity: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Sélectionner une ville</option>
                            {citiesByCountry[formData.dropoffCountry]?.map((city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de retour
                      </label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Heure de retour
                      </label>
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
                        <strong>Durée de location:</strong> {calculateDays()} jour(s)
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
                      <span className="font-medium text-gray-900">Je conduis moi-même</span>
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
                      <h3 className="font-semibold text-gray-900">Sélectionnez un chauffeur</h3>
                      <div className="grid gap-4">
                        {drivers.map((driver) => (
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
                              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                                {driver.image ? (
                                  <Image
                                    src={driver.image}
                                    alt={driver.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-bold">
                                    {driver.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900">{driver.name}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <StarRating rating={driver.rating} size={12} />
                                  <span>• {driver.age} ans</span>
                                  <span>• Permis {driver.permiscode}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{driver.location}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-blue-600">
                                  {driver.pricePerDay.toLocaleString()} FCFA
                                </p>
                                <p className="text-sm text-gray-500">/jour</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard className="text-blue-600" />
                    Informations de paiement
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
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="text-gray-600" />
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
                        J&apos;accepte les{' '}
                        <Link href="/terms" className="text-blue-600 hover:underline">
                          conditions générales de location
                        </Link>
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
                        J&apos;accepte la{' '}
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                          politique de confidentialité
                        </Link>
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
                        Je confirme que les détails de la réservation sont corrects
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
                    Récapitulatif de votre réservation
                  </h2>

                  {/* Vehicle Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Véhicule</h3>
                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={vehicle.image || '/client/images/placeholder-car.jpg'}
                          alt={vehicle.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{vehicle.name}</p>
                        <p className="text-gray-600">{vehicle.type} • {vehicle.transmission}</p>
                      </div>
                    </div>
                  </div>

                  {/* Rental Period */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Période de location</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Prise en charge</p>
                        <p className="font-medium">{formData.pickupCity}, {formData.pickupCountry}</p>
                        <p className="text-gray-600">{formData.pickupDate} à {formData.pickupTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Retour</p>
                        <p className="font-medium">
                          {formData.sameLocation
                            ? `${formData.pickupCity}, ${formData.pickupCountry}`
                            : `${formData.dropoffCity}, ${formData.dropoffCountry}`}
                        </p>
                        <p className="text-gray-600">{formData.dropoffDate} à {formData.dropoffTime}</p>
                      </div>
                    </div>
                    <p className="text-blue-600 font-semibold mt-2">Durée: {costs.days} jour(s)</p>
                  </div>

                  {/* Driver */}
                  {formData.selectedDriver && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Chauffeur</h3>
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                          {formData.selectedDriver.image ? (
                            <Image
                              src={formData.selectedDriver.image}
                              alt={formData.selectedDriver.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                              {formData.selectedDriver.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{formData.selectedDriver.name}</p>
                          <div className="flex items-center gap-2">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-sm text-gray-600">{formData.selectedDriver.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Méthode de paiement</h3>
                    <p className="font-medium">
                      {paymentMethods.find((m) => m.id === formData.paymentMethod)?.name || 'Non sélectionné'}
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
                    Confirmer la réservation
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Récapitulatif</h3>

              {/* Vehicle */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                <div className="relative w-20 h-14 rounded-lg overflow-hidden">
                  <Image
                    src={vehicle.image || '/client/images/placeholder-car.jpg'}
                    alt={vehicle.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{vehicle.name}</p>
                  <p className="text-sm text-gray-500">{vehicle.type}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="mb-4">
                <p className="text-gray-600 mb-1">Durée de location</p>
                <p className="font-bold text-lg">{costs.days} jour(s)</p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Véhicule ({costs.days} jours)</span>
                  <span>{costs.vehicleCost.toLocaleString()} FCFA</span>
                </div>
                {formData.selectedDriver && (
                  <div className="flex justify-between text-gray-600">
                    <span>Chauffeur ({costs.days} jours)</span>
                    <span>{costs.driverCost.toLocaleString()} FCFA</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Taxes et frais</span>
                  <span>{costs.taxes.toLocaleString()} FCFA</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  {costs.total.toLocaleString()} FCFA
                </span>
              </div>

              {/* Terms Link */}
              <p className="text-sm text-gray-500 mt-4 text-center">
                En réservant, vous acceptez nos{' '}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  conditions générales
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
