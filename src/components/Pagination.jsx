import '../css/Pagination.scss'

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (!totalPages || totalPages <= 1) {
        return null
    }

    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 7
        
        if (totalPages <= maxVisible) {
            // Show all pages if total is less than max visible, but replace last with "Last"
            for (let i = 1; i < totalPages; i++) {
                pages.push(i)
            }
            pages.push('last')
        } else {
            // Always show first page
            pages.push(1)
            
            if (currentPage <= 4) {
                // Near the start
                for (let i = 2; i <= 5; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push('last')
            } else if (currentPage >= totalPages - 3) {
                // Near the end
                pages.push('...')
                for (let i = totalPages - 4; i < totalPages; i++) {
                    pages.push(i)
                }
                pages.push('last')
            } else {
                // In the middle
                pages.push('...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push('last')
            }
        }
        
        return pages
    }

    const pageNumbers = getPageNumbers()

    return (
        <div className="pagination">
            <button
                className="pagination-button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                Previous
            </button>
            
            <div className="pagination-numbers">
                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                                ...
                            </span>
                        )
                    }
                    
                    const isLast = page === 'last'
                    const pageNumber = isLast ? totalPages : page
                    const isActive = currentPage === pageNumber
                    
                    return (
                        <button
                            key={isLast ? 'last' : page}
                            className={`pagination-number ${isActive ? 'active' : ''}`}
                            onClick={() => onPageChange(pageNumber)}
                            aria-label={isLast ? 'Last page' : `Page ${pageNumber}`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {isLast ? 'Last' : page}
                        </button>
                    )
                })}
            </div>
            
            <button
                className="pagination-button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                Next
            </button>
        </div>
    )
}

export default Pagination

