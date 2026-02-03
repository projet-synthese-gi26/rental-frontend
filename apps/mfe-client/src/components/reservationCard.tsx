"use client";

import { Star, Users, Fuel, UserPlus2 } from "lucide-react";
import { vehicleService } from '@/services/vehicleService';
// import { Vehicle } from '@/types/vehicleType';
import { useReservationStore } from "@/store/workflow.store";

import { useRouter } from "next/navigation";


const ReservationCard = () => {
  const router = useRouter();
  const {
    vehicle,
    driver,
    bookingDates,
    setBookingDates,
    removeDriver,
  } = useReservationStore();
console.log("bookingDates", bookingDates);

  if (!vehicle) return null;
  

  /* ------------------ Helpers ------------------ */
  const rentalPrice = vehicle.pricePerDay * bookingDates.days;

  const driverPrice = (driver ? driver.pricePerDay * bookingDates.days : 0);

  const serviceFee = 10;
  const totalPrice = rentalPrice + driverPrice + serviceFee;

   const handleBooking = async () => {
    if (!vehicle) return;

    try {
      const success = await vehicleService.bookVehicle(vehicle.id, {
        start: new Date(bookingDates.start),
        end: new Date(bookingDates.end)
      });

      if (success) {
        alert('Réservation effectuée avec succès !');
        router.push('/rental-process/policy');
      } else {
        alert('Ce véhicule n\'est plus disponible pour ces dates.');
      }
    } catch (err) {
      alert('Erreur lors de la réservation');
      console.error(err);
    }
  };

  /* ------------------ Render ------------------ */
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      {/* Vehicle info */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {vehicle.name}
            </h1>
            <p className="text-gray-500">
              {vehicle.brand} {vehicle.model} • {vehicle.year}
            </p>
          </div>
          <div className="flex items-center bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
            <Star size={16} className="fill-current mr-1" />
            <span className="font-semibold">{vehicle.rating}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 text-sm">
          <span className="flex items-center mr-4">
            <Users size={16} className="mr-1" />
            {vehicle.passengers} personnes
          </span>
          <span className="flex items-center">
            <Fuel size={16} className="mr-1" />
            {vehicle.fuelType}
          </span>
        </div>
      </div>

      {/* Price per day */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Prix par jour</span>
          <span className="text-3xl font-bold text-blue-600">
            ${vehicle.pricePerDay}
          </span>
        </div>
        <p className="text-sm text-gray-500">Taxes incluses</p>
      </div>

      {/* Dates */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={bookingDates.start}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              setBookingDates(e.target.value, bookingDates.end) // ça fonctionnera correctement maintenant
            }
          />

          <input
            type="date"
            value={bookingDates.end}
            min={bookingDates.start}
            onChange={(e) =>
              setBookingDates(bookingDates.start, e.target.value)
            }
          />  
        </div>

        {/* Driver option */}
        {driver ? (
          <div className="flex justify-between items-center p-3 border rounded-lg">
            <span>
              {driver.name} × {bookingDates.days} jour(s)
            </span>
            <button
              onClick={() => {removeDriver(); router.push(`/vehicles/${vehicle.id}`)}}
              className="text-red-500 text-sm"
            >
              Retirer
            </button>
          </div>
        ) : (
          <div className="flex items-center text-gray-400 p-3 border rounded-lg">
            <UserPlus2 className="mr-2" />
            Aucun chauffeur sélectionné
          </div>
        )}

        {/* Price breakdown */}
        <div className="border-t pt-4 space-y-2 text-gray-600">
          <div className="flex justify-between">
            <span>
              ${vehicle.pricePerDay} × {bookingDates.days} jour(s)
            </span>
            <span>${rentalPrice}</span>
          </div>

          {driver && (
            <div className="flex justify-between">
              <span>
                Chauffeur × {bookingDates.days} jour(s)
              </span>
              <span>${driverPrice}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Frais de service</span>
            <span>${serviceFee}</span>
          </div>

          <div className="border-t pt-2 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-blue-600">${totalPrice}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-3">
        <button
          onClick={handleBooking}
          disabled={!vehicle.available || !bookingDates.start || !bookingDates.end}
          className="w-full py-4 rounded-lg font-semibold text-lg bg-blue-600 text-white disabled:bg-gray-300"
        >
          {vehicle.available ? 'Proceed booking' : 'Non disponible'}
        </button>
        {!driver && (
          <button onClick={() => router.push("/drivers")} className="w-full py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
            <UserPlus2 size={20} className="inline mr-2" />
            Add a driver
          </button>
        )} 
      </div>
    </div>
  );
};

export default ReservationCard;
