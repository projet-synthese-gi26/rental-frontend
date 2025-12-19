'use client'
import { useState, useEffect } from "react";
import { Car, Settings, Search, Filter, Star } from "lucide-react";
import { Driver } from "@/types/driverType";
import DriverCard from "@/components/driverCard";
import NoElementFound from "@/components/NoElementFound";
import { driverService } from "@/services/driverService";
import { resolve } from "path";

export default function DriversPage() {
const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [, setError] = useState<string | null>(null);

   useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const data = await driverService.getAllAvailableDrivers();
      setDrivers(data);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des véhicules");
      console.error(err);
  };
}

    //  average of rating calculation
    let a = 0;
    drivers.forEach(d => {a += d.rating;})
    const average = a/drivers.length;

  // Filtrage des véhicules
  const filteredDrivers = drivers.filter(driver => {
    const matchesType = selectedType === "all" || driver.permiscode.toLowerCase().includes(selectedType.toLowerCase());
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.permiscode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const driverTypes = ["all", ...new Set(drivers.map(v => v.permiscode))];
  
  return (
    // <div className=" flex items-center justify-center ">
    //   drivers page
    // </div>
    <div className="min-h-screen">
          {/* Header avec héros */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
            <div className=" w-full sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Find the perfect driver</h1>
                <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">Choose from our wide selection of drivers. Flexible rental, transparent prices.</p>
                
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
                    All drivers
                  </button>
                  {driverTypes.filter(type => type !== "all").map((type) => (
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
                    <p className="text-sm text-gray-600">Availables drivers</p>
                    <p className="text-2xl font-bold">{drivers.length}</p>
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
                    <p className="text-sm text-gray-600"> All drivers permis code types </p>
                    <p className="text-2xl font-bold">{driverTypes.length - 1}</p>
                  </div>
                </div>
              </div>
            </div>
    
            {/* Résultats */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Ours drivers</h2>
                  <p className="text-gray-600">{filteredDrivers.length} available(s) véhicle(s) </p>
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
                    {driverTypes.filter(type => type !== "all").map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
    
              {/* Grille des véhicules */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDrivers.map((driver) => (
                <DriverCard key={driver.id} {...driver}/>
                ))}
              </div>
    
              {/* Message si aucun résultat */}
              {filteredDrivers.length === 0 && (
                <NoElementFound element="driver" icon={Car} onButtonClick={() => {
                      setSearchTerm("");
                      setSelectedType("all");
                    }}/>
              )}
            </div>
          </div>
        </div>
  );
}
