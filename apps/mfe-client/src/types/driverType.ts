export interface Driver {
  id: number;
  name: string;
  age: number;
  email: string;
  phone: string;
  permiscode: string;
  pricePerDay: number;
  image: string;
  rating:  number;
  available: boolean;
  location: string;
  description?: string;
}