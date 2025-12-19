import { Driver } from "@/types/driverType";

// Mock data des véhicules
export const mockDrivers: Driver[] = [
  {
    id: 1,
    name: "John Doe",
    age: 39,
    email: "johndoe@gml.com",
    phone: "+127 00000000",
    permiscode: "B",
    pricePerDay: 40,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop",
    rating: 4.8,
    available: true,
    location: "Yaoundé Centre",
    description: "Faites moi confiance pour une conduite en toute sécurité"
  },
  {
    id: 2,
    name: "Micel ATANGANE",
    age: 29,
    email: "michelat@gml.com",
    phone: "+127 00000090",
    permiscode: "B",
    pricePerDay: 65,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
    rating: 4.7,
    available: true,
    location: "Douala Akwa",
    description: "Conduite sûr et acceuillante, de quoi passer un bon moment"
  },
  {
    id: 3,
    name: "BMANI ELieot",
    age: 53,
    email: "elieot@gml.com",
    phone: "+127 60700000",
    permiscode: "B",
    pricePerDay: 29,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
    rating: 3.9,
    available: true,
    location: "Yaoundé Bastos",
    description: "La force de l'expérience."
  },
  {
    id: 4,
    name: "Baby Driver",
    age: 21,
    email: "driver257@gml.com",
    phone: "+127 00000003",
    permiscode: "B",
    pricePerDay: 119,
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop",
    rating: 3.5,
    available: true,
    location: "Douala Bonapriso",
    description: "La pontualité est l'une de mes plus grandes qualités."
  }
];

export const driverService = {
  getAllDrivers: (): Promise<Driver[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDrivers), 300); // Simuler un délai API
    });
  },

  getAllAvailableDrivers: (): Promise<Driver[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {const drivers = mockDrivers.filter(d => d.available === true);resolve(drivers)}, 300); // Simuler un délai API
    });
  },

  getDriverById: (id: number): Promise<Driver | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const driver = mockDrivers.find(d => d.id === id);
        resolve(driver);
      }, 200);
    });
  },

  // Simuler une réservation
  bookDriver: (driverId: number, dates: { start: Date; end: Date }): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const driver = mockDrivers.find(d => d.id === driverId);
        if (driver && driver.available) {
          // Dans une vraie app, on mettrait à jour la disponibilité
          console.log(`Véhicule ${driverId} réservé du ${dates.start} au ${dates.end}`);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  }
};
