import { Vehicle } from "@/types/vehicleType";

// Mock data des véhicules
export const mockVehicles: Vehicle[] = [
  {
    id: 1,
    name: "Tesla Model 3",
    brand: "Tesla",
    model: "Model 3",
    year: 2023,
    type: "electrique",
    pricePerDay: 89,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop",
    passengers: 5,
    transmission: "automatique",
    fuelType: "electrique",
    rating: 4.8,
    available: true,
    features: ["Climatisation", "GPS", "Bluetooth", "Autopilot", "Écran tactile"],
    location: "Yaoundé Centre",
    mileage: 15000,
    airConditioning: true,
    gps: true,
    description: "Véhicule électrique haut de gamme avec autopilot intégré."
  },
  {
    id: 2,
    name: "Toyota RAV4",
    brand: "Toyota",
    model: "RAV4",
    year: 2022,
    type: "suv",
    pricePerDay: 65,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
    passengers: 5,
    transmission: "automatique",
    fuelType: "hybride",
    rating: 4.6,
    available: true,
    features: ["4x4", "Toit panoramique", "Caméra de recul", "Sièges chauffants"],
    location: "Douala Akwa",
    mileage: 25000,
    airConditioning: true,
    gps: true,
    description: "SUV hybride économique et spacieux."
  },
  {
    id: 3,
    name: "BMW X5",
    brand: "BMW",
    model: "X5",
    year: 2023,
    type: "luxe",
    pricePerDay: 129,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
    passengers: 7,
    transmission: "automatique",
    fuelType: "essence",
    rating: 4.7,
    available: true,
    features: ["Intérieur cuir", "Système audio premium", "4 roues motrices"],
    location: "Yaoundé Bastos",
    mileage: 8000,
    airConditioning: true,
    gps: true,
    description: "SUV luxueux avec toutes les options."
  },
  {
    id: 4,
    name: "Peugeot 208",
    brand: "Peugeot",
    model: "208",
    year: 2021,
    type: "compacte",
    pricePerDay: 39,
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop",
    passengers: 5,
    transmission: "manuelle",
    fuelType: "essence",
    rating: 4.2,
    available: true,
    features: ["Écran tactile", "Aide au stationnement", "Apple CarPlay"],
    location: "Douala Bonapriso",
    mileage: 35000,
    airConditioning: true,
    gps: false,
    description: "Voiture citadine économique et maniable."
  },
  {
    id: 5,
    name: "Mercedes Classe C",
    brand: "Mercedes",
    model: "Classe C",
    year: 2023,
    type: "berline",
    pricePerDay: 99,
    image: "https://images.unsplash.com/photo-1563720223488-8f2f62a6e71a?w=800&h=600&fit=crop",
    passengers: 5,
    transmission: "automatique",
    fuelType: "diesel",
    rating: 4.5,
    available: false,
    features: ["Écran panoramique", "Sièges massants", "Assistance conduite"],
    location: "Yaoundé Centre",
    mileage: 12000,
    airConditioning: true,
    gps: true,
    description: "Berline premium avec confort exceptionnel."
  },
  {
    id: 6,
    name: "Hilux 4x4",
    brand: "Toyota",
    model: "Hilux",
    year: 2022,
    type: "utilitaire",
    pricePerDay: 75,
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&h=600&fit=crop",
    passengers: 5,
    transmission: "manuelle",
    fuelType: "diesel",
    rating: 4.4,
    available: true,
    features: ["4x4", "Double cabine", "Plateau utile"],
    location: "Bafoussam Centre",
    mileage: 45000,
    airConditioning: true,
    gps: false,
    description: "Pick-up robuste pour tous terrains."
  },
  {
    id: 7,
    name: "Porsche 911",
    brand: "Porsche",
    model: "911",
    year: 2023,
    type: "sport",
    pricePerDay: 299,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
    passengers: 2,
    transmission: "automatique",
    fuelType: "essence",
    rating: 4.9,
    available: true,
    features: ["Sièges sport", "Roues alliage", "Système sport exhaust"],
    location: "Douala Akwa",
    mileage: 5000,
    airConditioning: true,
    gps: true,
    description: "Voiture de sport légendaire."
  },
  {
    id: 8,
    name: "Renault Zoe",
    brand: "Renault",
    model: "Zoe",
    year: 2022,
    type: "electrique",
    pricePerDay: 55,
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&h=600&fit=crop",
    passengers: 5,
    transmission: "automatique",
    fuelType: "electrique",
    rating: 4.3,
    available: true,
    features: ["Recharge rapide", "Autonomie 400km", "Écran tactile"],
    location: "Yaoundé Nlongkak",
    mileage: 18000,
    airConditioning: true,
    gps: true,
    description: "Voiture électrique citadine."
  }
];

// Service de véhicules
export const vehicleService = {
  // Récupérer tous les véhicules
  getAllVehicles: (): Promise<Vehicle[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockVehicles), 300); // Simuler un délai API
    });
  },

  getAllAvailableVehicles: (): Promise<Vehicle[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {const vehicles = mockVehicles.filter(v => v.available === true);resolve(vehicles)}, 300); // Simuler un délai API
    });
  },

  // Récupérer un véhicule par ID
  getVehicleById: (id: number): Promise<Vehicle | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const vehicle = mockVehicles.find(v => v.id === id);
        resolve(vehicle);
      }, 200);
    });
  },

  // Simuler une réservation
  bookVehicle: (vehicleId: number, dates: { start: Date; end: Date }): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const vehicle = mockVehicles.find(v => v.id === vehicleId);
        if (vehicle && vehicle.available) {
          // Dans une vraie app, on mettrait à jour la disponibilité
          console.log(`Véhicule ${vehicleId} réservé du ${dates.start} au ${dates.end}`);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  }
};
