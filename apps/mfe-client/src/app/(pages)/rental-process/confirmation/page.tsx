'use client'

import { useRouter } from "next/navigation";

export default function ConfirmReservationPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
         <div className=" flex items-center justify-center ">
            The reservation
        </div>
        <div className="space-x-2 mt-4 flex">
            <button onClick={() => router.push("/vehicles")} className="flex-1 p-2 bg-red-700 rounded-md"> Discard</button>
            <button onClick={() => {router.push("/notifications")}} className=" flex-1 p-2 bg-green-600 rounded-md"> Confirm the reservation</button>
        </div>
    </div>
  );
}
