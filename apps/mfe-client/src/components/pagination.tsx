import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageInfo?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  maxVisiblePages?: number;
}

interface SizeClasses {
  button: string;
  icon: string;
  gap: string;
  margin: string;
  pageInfo: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  size = 'medium',
  maxVisiblePages = 3
}) => {
  if (totalPages <= 1) return null;

  // Tailles adaptables
  const sizeClasses: Record<'small' | 'medium' | 'large', SizeClasses> = {
    small: {
      button: 'w-8 h-8 text-xs',
      icon: 'w-4 h-4',
      gap: 'gap-2',
      margin: 'mt-4 mb-8',
      pageInfo: 'text-xs'
    },
    medium: {
      button: 'w-10 h-10 text-sm',
      icon: 'w-[18px] h-[18px]',
      gap: 'gap-4',
      margin: 'mt-6 mb-16',
      pageInfo: 'text-xs'
    },
    large: {
      button: 'w-12 h-12 text-base',
      icon: 'w-5 h-5',
      gap: 'gap-6',
      margin: 'mt-8 mb-20',
      pageInfo: 'text-sm'
    }
  };

  const currentSize = sizeClasses[size];

  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = (): (React.ReactElement | null)[] => {
    return [...Array(maxVisiblePages)].map((_, i) => {
      const pageNum = currentPage - Math.floor(maxVisiblePages / 2) + i;
      if (pageNum < 1 || pageNum > totalPages) return null;
      
      return (
        <button
          key={`page-${pageNum}`}
          onClick={() => handlePageChange(pageNum)}
          className={`${currentSize.button} rounded-full font-semibold transition-all duration-200 ${
            currentPage === pageNum
              ? `bg-primary text-white shadow-lg scale-110`
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          aria-label={`Aller à la page ${pageNum}`}
          aria-current={currentPage === pageNum ? 'page' : undefined}
        >
          {pageNum}
        </button>
      );
    });
  };

  const shouldShowFirstPage = (): boolean => {
    return currentPage > Math.ceil(maxVisiblePages / 2) + 1;
  };

  const shouldShowFirstEllipsis = (): boolean => {
    return currentPage > Math.ceil(maxVisiblePages / 2) + 2;
  };

  const shouldShowLastPage = (): boolean => {
    return currentPage < totalPages - Math.ceil(maxVisiblePages / 2);
  };

  const shouldShowLastEllipsis = (): boolean => {
    return currentPage < totalPages - Math.ceil(maxVisiblePages / 2) - 1;
  };

  return (
    <div className={`flex items-center justify-center ${currentSize.gap} ${currentSize.margin} ${className}`}>
      {/* Bouton Précédent */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${currentSize.button} rounded-full flex items-center justify-center transition-all duration-200 ${
          currentPage === 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : `bg-primary text-white hover:bg-blue-900 shadow-lg hover:shadow-xl`
        }`}
        aria-label="Page précédente"
        type="button"
      >
        <svg className={currentSize.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Numéros de pages */}
      <div className="flex items-center gap-1">
        {/* Première page si nécessaire */}
        {shouldShowFirstPage() && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className={`${currentSize.button} rounded-full font-semibold text-gray-600 hover:bg-gray-100 transition-all duration-200`}
              aria-label="Aller à la page 1"
              type="button"
            >
              1
            </button>
            {shouldShowFirstEllipsis() && (
              <span className="text-gray-400 px-1" aria-hidden="true">...</span>
            )}
          </>
        )}
        
        {/* Pages centrales */}
        {renderPageNumbers()}

        {/* Dernière page si nécessaire */}
        {shouldShowLastPage() && (
          <>
            {shouldShowLastEllipsis() && (
              <span className="text-gray-400 px-1" aria-hidden="true">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`${currentSize.button} rounded-full font-semibold text-gray-600 hover:bg-gray-100 transition-all duration-200`}
              aria-label={`Aller à la page ${totalPages}`}
              type="button"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Bouton Suivant */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${currentSize.button} rounded-full flex items-center justify-center transition-all duration-200 ${
          currentPage === totalPages
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : `bg-primary text-white hover:bg-blue-900 shadow-lg hover:shadow-xl`
        }`}
        aria-label="Page suivante"
        type="button"
      >
        <svg className={currentSize.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      
        <div className="text-center ml-2">
          <span className={`${currentSize.pageInfo} text-secondary`}>
            {currentPage} / {totalPages}
          </span>
        </div>
    
    </div>
  );
};

export default Pagination;

/*
// Exemples d'utilisation TypeScript :

// Utilisation basique
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>

// Avec personnalisation complète
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page: number) => setCurrentPage(page)}
  size="large"
  primaryColor="bg-green-500"
  primaryHoverColor="hover:bg-green-600"
  showPageInfo={false}
  maxVisiblePages={5}
  className="my-custom-pagination"
/>

// Pour mobile/responsive
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  size="small"
  maxVisiblePages={3}
  className="md:hidden" // Afficher seulement sur mobile
/>

// Avec gestion d'erreur TypeScript
const handlePageChange = useCallback((page: number): void => {
  if (page < 1 || page > totalPages) return;
  setCurrentPage(page);
}, [totalPages]);

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>
*/