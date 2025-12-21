'use client'

import { useRouter } from "next/navigation";

export default function PaymentMethodPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
         <div className=" flex items-center justify-center ">
            choose payment methods
        </div>
        <div className="space-x-2 mt-4 flex">
            <button onClick={() => router.push("/vehicles")} className="flex-1 p-2 bg-red-700 rounded-md"> Discard</button>
            <button onClick={() => {router.push("/rental-process/confirmation")}} className=" flex-1 p-2 bg-green-600 rounded-md"> Continue</button>
        </div>
    </div>
  );
}
