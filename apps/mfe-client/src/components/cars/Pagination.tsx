import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
    totalItems: number;
    lang: 'FR' | 'EN';
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    lang,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <>
            <div className="mt-12 flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft size={20} />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;

                        if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                            return (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`min-w-[40px] h-10 rounded-xl font-semibold text-sm transition-all ${
                                        currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                        ) {
                            return (
                                <span key={page} className="text-slate-400">
                                    ...
                                </span>
                            );
                        }
                        return null;
                    })}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Pagination Info */}
            <p className="text-center text-sm text-slate-500 mt-4">
                {lang === 'FR' ? 'Page' : 'Page'} {currentPage} {lang === 'FR' ? 'sur' : 'of'} {totalPages}
                {' • '}
                {lang === 'FR' ? 'Affichage de' : 'Showing'} {startIndex + 1}-{Math.min(endIndex, totalItems)} {lang === 'FR' ? 'sur' : 'of'} {totalItems}
            </p>
        </>
    );
}
