export const PreorderConfirmationContentSkeleton = () => {
    return (
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-lg">
            <div className="mb-6 flex justify-center">
                {/* Placeholder for Image */}
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
            </div>

            <div className="skeleton-header mb-6">
                {/* Placeholder for title */}
                <div className="mx-auto mb-2 h-8 w-3/4 rounded bg-gray-200"></div>
            </div>

            <div className="skeleton-content mb-4">
                {/* Placeholder for content */}
                <div className="mb-2 h-4 w-full rounded bg-gray-200"></div>
                <div className="mb-4 h-6 w-2/3 rounded bg-gray-200"></div>
            </div>

            <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <div className="mb-2 h-6 w-1/3 rounded bg-gray-200"></div>
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="mb-2 flex items-center">
                        <div className="mr-2 h-4 w-1/4 rounded bg-gray-200"></div>
                        <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                    </div>
                ))}
            </div>

            <div className="skeleton-footer mb-8">
                {/* Placeholder for footer text */}
                <div className="mx-auto h-4 w-3/4 rounded bg-gray-200"></div>
            </div>

            <div className="skeleton-button mb-4">
                {/* Placeholder for FormButton */}
                <div className="h-10 w-full rounded bg-gray-200"></div>
            </div>

            <div className="skeleton-contact">
                {/* Placeholder for contact info */}
                <div className="mx-auto h-4 w-2/3 rounded bg-gray-200"></div>
            </div>
        </div>
    );
};
