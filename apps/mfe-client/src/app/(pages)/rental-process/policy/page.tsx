'use client'

import Contrat from "@/components/contrat";
import { PolicyService } from "@/services/policyService";
import { Policy } from "@/types/policyType";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PolicyPage() {
  const router = useRouter();
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [, setError] = useState<string | null>(null);
  
    useEffect(() => {
      loadPolicy();
    }, []);
  
    const loadPolicy = async () => {
      try {
        const data = await PolicyService.getPolicyByOrgId(1);
        
        if (!data) {
          setError('Policy not found');
          return;
        }
        
        setPolicy(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement du véhicule');
        console.error(err);
      } 
    };

  return (
    <div className="container mx-auto p-6">
        <div className=" flex items-center justify-center ">
            <Contrat title={policy?.title || "Conditions générales de locations"} articles={policy?.articles || []}/>
        </div>
        <div className="space-x-2 mt-4 flex">
            <button onClick={() => router.push("/vehicles")} className="flex-1 p-2 bg-red-700 rounded-md"> I disagree</button>
            <button onClick={() => {router.push("/rental-process/payment")}} className=" flex-1 p-2 bg-green-600 rounded-md"> I agree</button>

        </div>
    </div>
  );
}
