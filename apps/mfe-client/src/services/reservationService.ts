import { Reservation } from "@/types/reservationType";

export const mockReservations: Reservation[] = [
  {
    id: 1,
    issueDate: "23/12/2025",
    status: "pending",
    price: 2023,
  },
  {
    id: 2,
    issueDate: "25/12/2025",
    status: "confirmed",
    price: 4093,
  },
  {
    id: 3,
    issueDate: "23/12/2025",
    status: "pending",
    price: 223,
   
  },
  {
    id: 4,
    issueDate: "26/12/2025",
    status: "pending",
    price: 123,
  }, 
];

export const reservationService = {
  getAllReservations: (): Promise<Reservation[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockReservations), 300); // Simuler un délai API
    });
  },

  getReservationById: (id: number): Promise<Reservation | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reservation = mockReservations.find(v => v.id === id);
        resolve(reservation);
      }, 200);
    });
  },
};
