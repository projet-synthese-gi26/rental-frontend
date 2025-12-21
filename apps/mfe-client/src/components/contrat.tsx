'use client'

import { ContratProps } from "@/types/policyType";

const Contrat = ({title, articles}: ContratProps) => {
  return (
    <div className="container bg-white p-2 md:p-12 rounded-md overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
        {/* Titre du contrat */}
        <div className="text-center my-4">
            <h2 className="text-xl md:text-xl font-bold text-blue-700">{title}</h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
        </div>
        {/* Contenu */}
        <div className="p-5">
            {articles.map((article) => (
                <div key={article.article_number} className="mb-4">
                    <h2 className="text-md md:text-md font-bold text-blue-700">Article {article.article_number}: {article.title}</h2>
                    <hr className="w-full bg-orange-500 mx-auto rounded-full"/>
                    <p className="text-sm text-justify">{article.content}</p>
                </div>
            ))}       
        </div>
    </div>
  )
}

export default Contrat;