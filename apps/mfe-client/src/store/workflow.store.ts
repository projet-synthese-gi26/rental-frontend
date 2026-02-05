import { Driver } from "@/types/driverType";
import { Vehicle } from "@/types/vehicleType";
import { create } from "zustand";

type ReservationState = {
    vehicle: Vehicle | null;
    driver: Driver | null;

    bookingDates: {
        start: string;
        end: string;
        days: number;
    };

    setVehicle: (vehicle: Vehicle) => void;

    setBookingDates: (start: string, end: string) => void;

    addDriver: (driver: Driver) => void;
    removeDriver: () => void;
};

export const useReservationStore = create<ReservationState>((set) => ({
    vehicle: null,
    driver: null,

    bookingDates: {
        start: "",
        end: "",
        days: 1,
    },

    setVehicle: (vehicle) => set({ vehicle }),

    setBookingDates: (start: string, end: string) =>
        set(() => {
            const days =
                start && end
                    ? Math.max(
                        1,
                        Math.ceil(
                            (new Date(end).getTime() - new Date(start).getTime()) /
                            (1000 * 3600 * 24)
                        )
                    )
                    : 1;
            return { bookingDates: { start, end, days } };
        }),

    addDriver: (driver) => set({ driver }),

    removeDriver: () => set({ driver: null }),
}));