export interface Policy {
    id: string;
    org_id: number;
    agency_id: number | null;
    vehicle_id: number |null;
    title: string;
    version:string;
    is_active: boolean;
    articles: Article [] ;
}

interface Article {
    article_number: number;
    title: string;
    content: string;
}

export interface ContratProps {
    title: string;
    articles: Article [] ;
}