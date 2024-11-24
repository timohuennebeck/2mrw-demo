import { SearchIcon } from "lucide-react";

interface TestimonialsFiltersProps {
    filterRating: number | null;
    setFilterRating: (rating: number | null) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    sortBy: "recent" | "rating";
    setSortBy: (sort: "recent" | "rating") => void;
}

export const TestimonialsFilters = ({
    filterRating,
    setFilterRating,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
}: TestimonialsFiltersProps) => {
    return (
        <div className="mb-12 mt-16">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                {/* Rating Filters */}
                <div className="flex flex-wrap gap-2">
                    {[5, 4, 3].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                            className={`rounded-full px-4 py-2 text-sm transition-colors ${
                                filterRating === rating
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {rating} Stars
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {/* Search */}
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search testimonials..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:w-64"
                        />
                    </div>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as "recent" | "rating")}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="rating">Highest Rated</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
