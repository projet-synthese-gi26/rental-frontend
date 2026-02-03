'use client'

import Pagination from "@/components/pagination";
import { reservationService } from "@/services/reservationService";
import { Reservation } from "@/types/reservationType";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([])
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    useEffect(() => {
      loadReservations();
    }, []);

    const loadReservations = async () => {
        try {
          const fetchedReservations = await reservationService.getAllReservations();
          setReservations(fetchedReservations);
        } catch (err) {
          console.error("Erreur lors du chargement des utilisateurs.");
        } 
      };

    const handleEdit = (id: number) => {
      router.push(`/client/reservations/${id}`);
    };

    const handleDelete = async (id: number) => {
      if (typeof id !== 'number') {
        alert("ID utilisateur invalide.");
        return;
      }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReservations = reservations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(reservations.length / itemsPerPage);
    // const assetReservations = reservations.filter(usr => usr.state === "asset")
  
  return (
    <div className=" items-center justify-center ">
      {/* reservations page */}
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 ">
        <div className="justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Vos reservations ({reservations.length})</h2>
          {/* <p className="text-sm text-secondary">{assetReservations.length} reservations en cours</p> */}
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700">
          <table className=" w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-primary ">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-white ">N°</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white ">Faite le</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white ">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white ">Prix</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white ">Actions</th>
              </tr>
            </thead>
            <tbody className=" divide-y divide-secondary text-text">
              {currentReservations.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center px-4 py-6 text-gray-500 dark:text-gray-400">
                    Aucune reservation trouvé.
                  </td>
                </tr>
              )}

              {currentReservations.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 whitespace-nowrap">{r.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.issueDate}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.status}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.price}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(r.id)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        aria-label={`Modifier ${r.id}`}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        aria-label={`Supprimer ${r.id}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page: number) => setCurrentPage(page)}
          size="large"
          showPageInfo={false}
          maxVisiblePages={itemsPerPage}
        />
      </div>
    </div>
  );
}
