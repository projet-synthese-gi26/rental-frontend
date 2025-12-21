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
    image : "/client/images/drivers/johndoe.webp",
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
    image: "/client/images/drivers/micelatangane.webp",
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
    image: "/client/images/drivers/bmanielieot.webp",
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
    image: "/client/images/drivers/babydriver.webp",
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
