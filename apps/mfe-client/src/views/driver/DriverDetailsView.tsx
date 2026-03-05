import React from 'react';
import { User, CreditCard, Star, Phone, ShieldCheck } from 'lucide-react';

const DriverDetailView = ({ data }: any) => {
  const { driver, pricing, rating, reviews} = data;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      {/* Header / Profil */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row items-center gap-6">
        <img 
          src={driver.profilUrl || "/api/placeholder/150/150"} 
          alt={`${driver.firstname} ${driver.lastname}`}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
        />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-800">{driver.firstname} {driver.lastname}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-gray-600">
            <span className="flex items-center gap-1"><User size={16}/> {driver.age} ans</span>
            <span className="flex items-center gap-1 text-blue-600 font-medium">
              <Star size={16} className="fill-current"/> {rating}/5
            </span>
            <span className="flex items-center gap-1"><Phone size={16}/> {driver.tel}</span>
          </div>
          <div className="mt-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${driver.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              Statut: {driver.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 italic">Agence ID</p>
          <p className="font-mono text-xs text-gray-400">{driver.agencyId.substring(0, 8)}...</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarification */}
        <div className="bg-white p-5 rounded-lg shadow-sm border-t-4 border-green-500">
          <h3 className="flex items-center gap-2 font-bold text-gray-700 mb-4">
            <CreditCard size={18}/> Tarifs
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Par heure</span>
              <span className="text-lg font-bold">{pricing.pricePerHour} {pricing.currency}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-gray-500">Par jour</span>
              <span className="text-lg font-bold text-green-600">{pricing.pricePerDay} {pricing.currency}</span>
            </div>
          </div>
        </div>

        {/* Documents & Permis */}
        <div className="bg-white p-5 rounded-lg shadow-sm border-t-4 border-blue-500 md:col-span-2">
          <h3 className="flex items-center gap-2 font-bold text-gray-700 mb-4">
            <ShieldCheck size={18}/> Documents & Vérifications
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <a href={driver.drivingLicenseUrl} target="_blank" className="p-3 bg-gray-50 rounded border hover:bg-blue-50 transition-colors flex items-center justify-between">
              <span className="text-sm">Permis de conduire</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded">Voir</span>
            </a>
            <a href={driver.cniUrl} target="_blank" className="p-3 bg-gray-50 rounded border hover:bg-blue-50 transition-colors flex items-center justify-between">
              <span className="text-sm">{"Pièce d'identité"}</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded">Voir</span>
            </a>
          </div>
        </div>

        {/* Derniers Avis */}
        <div className="md:col-span-3 bg-white p-5 rounded-lg shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Derniers avis clients</h3>
          <div className="space-y-4">
            {reviews.map((review : any) => (
              <div key={review.id} className="border-b last:border-0 pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{review.authorName}</p>
                    <div className="flex text-yellow-500 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < review.rating ? "fill-current" : "text-gray-300"} />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailView;