interface Props {
  page: number;
  count: number;
  pageSize?: number;
  onPageChange: (p: number) => void;
}

export function PaginationControls({ 
  page, count, pageSize = 10, onPageChange 
}: Props) {
  const totalPages = Math.ceil(count / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 
                    border-t text-sm text-gray-500">
      <span>{count} résultats — Page {page} / {totalPages}</span>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 rounded border 
                     disabled:opacity-40 hover:bg-gray-50"
        >
          ← Précédent
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 rounded border 
                     disabled:opacity-40 hover:bg-gray-50"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
