'use client'

import { useState, useEffect } from "react";
import { Car, Settings, Search, Filter, Star } from "lucide-react";
import { Vehicle } from "@/types/vehicleType";
import VehicleCard from "@/components/vehicleCard";
import NoElementFound from "@/components/NoElementFound";
import { vehicleService } from "@/services/vehicleService";


export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [, setError] = useState<string | null>(null);

   useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await vehicleService.getAllAvailableVehicles();
      setVehicles(data);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des véhicules");
      console.error(err);
  };
}

  //  average of rating calculation
  let a = 0;
  vehicles.forEach(v => {a += v.rating;})
  const average = a/vehicles.length;
  // Filtrage des véhicules
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesType = selectedType === "all" || vehicle.type.toLowerCase().includes(selectedType.toLowerCase());
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Types uniques pour les filtres
  const vehicleTypes = ["all", ...new Set(vehicles.map(v => v.type))];

  return (
    <div className="min-h-screen">
      {/* Header avec héros */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className=" w-full sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find the perfect vehicle</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">Choose from our wide selection of vehicles. Flexible rental, transparent prices.</p>
            
            {/* Barre de recherche */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher un véhicule, une marque ou un type..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filtres rapides */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button
                className={`px-4 py-2 rounded-full transition-all ${selectedType === "all" ? "bg-white text-blue-600" : "bg-white/10 hover:bg-white/20"}`}
                onClick={() => setSelectedType("all")}
              >
                All vehicles
              </button>
              {vehicleTypes.filter(type => type !== "all").map((type) => (
                <button
                  key={type}
                  className={`px-4 py-2 rounded-full transition-all ${selectedType === type ? "bg-white text-blue-600" : "bg-white/10 hover:bg-white/20"}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Car className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Availables vehicles</p>
                <p className="text-2xl font-bold">{vehicles.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <Star className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average note</p>
                <p className="text-2xl font-bold">{average}/5</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <Settings className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600"> All vehicles types</p>
                <p className="text-2xl font-bold">{vehicleTypes.length - 1}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Ours vehicles</h2>
              <p className="text-gray-600">{filteredVehicles.length} available(s) véhicle(s) </p>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Filter size={18} className="text-gray-500" />
              <span className="text-gray-600">Filtrered by :</span>
              <select 
                className="border rounded-lg px-3 py-1 bg-white"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All types</option>
                {vehicleTypes.filter(type => type !== "all").map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grille des véhicules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} {...vehicle}/>
            ))}
          </div>

          {/* Message si aucun résultat */}
          {filteredVehicles.length === 0 && (
            <NoElementFound element="vehicle" icon={Car} onButtonClick={() => {
                  setSearchTerm("");
                  setSelectedType("all");
                }}/>
          )}
        </div>

        {/* <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 mb-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Besoin d'un véhicule spécial ?</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Contactez-nous pour des locations longues durées, des véhicules utilitaires ou des besoins spécifiques.
            </p>
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl">
              Nous contacter
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}