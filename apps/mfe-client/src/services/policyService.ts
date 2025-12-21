import { Policy } from "@/types/policyType"

export const mockPolicies: Policy[] =[
  {
    "id": "100",
    "org_id": 1,
    "agency_id": null,
    "vehicle_id": null,
    "title": "Contrat global Easy-Rent",
    "version": "v1.0",
    "is_active": true,
    "articles": [
      {
        "article_number": 1,
        "title": "Objet du contrat",
        "content": "Le présent contrat a pour objet la location d'un véhicule auprès de notre organisation, selon les termes et conditions définis ci-après."
      },
      {
        "article_number": 2,
        "title": "Durée de la location",
        "content": "La location prend effet à la date et heure convenues et se termine à la date et heure de restitution du véhicule. Tout dépassement donnera lieu à une facturation supplémentaire."
      },
      {
        "article_number": 3,
        "title": "Conditions de paiement",
        "content": "Le paiement doit être effectué selon les modalités choisies par le client avant la prise du véhicule. Un dépôt de garantie peut être exigé."
      },
      {
        "article_number": 4,
        "title": "Assurances et responsabilités",
        "content": "Le véhicule est assuré selon les conditions de l'organisation. Le locataire est responsable des dommages non couverts par l'assurance, y compris les amendes et contraventions."
      }
    ]
  },
  {
    "id": "101",
    "org_id": 1,
    "agency_id": 10,
    "vehicle_id": null,
    "title": "Clauses spécifiques agence Yaoundé",
    "version": "v1.0",
    "is_active": true,
    "articles": [
      {
        "article_number": 1,
        "title": "Horaires de l’agence",
        "content": "La location ne peut débuter qu’entre 8h00 et 18h00, du lundi au samedi. Les locations hors horaires peuvent entraîner des frais supplémentaires."
      },
      {
        "article_number": 2,
        "title": "Zone de restitution",
        "content": "Le véhicule doit être restitué uniquement à l’agence de Yaoundé, sauf accord préalable avec l’agence."
      },
      {
        "article_number": 3,
        "title": "Dépôt de garantie spécifique",
        "content": "Un dépôt de garantie supplémentaire de 50 000 FCFA est requis pour cette agence, en plus du dépôt standard."
      }
    ]
  }
]

export const PolicyService = {
  // Récupérer tous les véhicules
  getAllVehicles: (): Promise<Policy[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPolicies), 300); // Simuler un délai API
    });
  },


  // Récupérer un véhicule par ID
  getPolicyById: (id: string): Promise<Policy | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const vehicle = mockPolicies.find(v => v.id === id);
        resolve(vehicle);
      }, 200);
    });
  },

   getPolicyByOrgId: (org_id: number): Promise<Policy | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const policy = mockPolicies.find(c => c.org_id === org_id && c.agency_id === null);
        resolve(policy);
      }, 200);
    });
  },

};