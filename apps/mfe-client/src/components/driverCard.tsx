'use client'

import { Star, ChevronRight, MapPin, Phone } from "lucide-react";
import { Driver } from "@/types/driverType";
import Link from "next/link";
import Image from "next/image";


const DriverCard = (driver: Driver) => {
  return (
    <div 
                
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                {/* Image du véhicule */}
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={driver.image} 
                    alt={driver.name}
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium">
                      Permis {driver.permiscode}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-full text-sm font-bold flex items-center">
                      <Star size={14} className="mr-1 fill-current" />
                      {driver.rating}
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                        {driver.name}
                      </h3>
                      <p className="text-gray-500 text-sm">{driver.age} years old</p>
                      <div className="flex items-center text-gray">
                        <Phone size={16} className="mr-1" />
                        <span className="text-sm">{driver.phone}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">${driver.pricePerDay}<span className="text-sm text-gray-500 font-normal">/jour</span></p>
                    </div>
                  </div>

                  {/* Icônes caractéristiques */}
                  <div className="flex items-center space-x-4 mb-4 text-gray-600">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      <span className="text-sm">{driver.location} </span>
                    </div>
                  </div>

                  {/* Bouton réservation */}
                  <Link href={`/drivers/${driver.id}`} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center group/btn transition-all duration-300 hover:shadow-lg">
                    Add this driver
                    <ChevronRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
  )
}

export default DriverCard;