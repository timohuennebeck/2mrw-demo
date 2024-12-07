"use client";

import { useState } from "react";
import { Star, Loader } from "lucide-react";
import TestimonialCard, { Testimonial } from "./TestimonialCard";
import FeaturedTestimonialCard from "./FeaturedTestimonialCard";
import { Button } from "../ui/button";

interface TestimonialsGridProps {
    title?: {
        badge?: string;
        main: React.ReactNode;
        subtitle?: string;
    };
    testimonials: Testimonial[];
    testimonialsPerPage?: number;
    className?: string;
}

const SectionHeader = ({ title }: { title: TestimonialsGridProps["title"] }) => {
    if (!title) return null;

    return (
        <div className="mx-auto flex flex-col gap-6 text-center">
            {title.badge && (
                <div className="flex items-center justify-center gap-2">
                    <div className="rounded-lg bg-purple-50 p-2">
                        <Star className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium uppercase text-purple-600">
                        {title.badge}
                    </span>
                </div>
            )}
            <h2 className="max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-5xl">
                {title.main}
            </h2>
            {title.subtitle && <p className="max-w-4xl text-lg text-gray-600">{title.subtitle}</p>}
        </div>
    );
};

const SortControls = ({
    sortBy,
    onSortChange,
}: {
    sortBy: "recent" | "rating";
    onSortChange: (sort: "recent" | "rating") => void;
}) => (
    <div className="flex justify-end">
        <div className="flex gap-2">
            {[
                { value: "recent", label: "Most Recent" },
                { value: "rating", label: "Highest Rated" },
            ].map(({ value, label }) => (
                <Button
                    key={value}
                    onClick={() => onSortChange(value as "recent" | "rating")}
                    variant={sortBy === value ? "default" : "secondary"}
                >
                    {label}
                </Button>
            ))}
        </div>
    </div>
);

const LoadMoreButton = ({ isLoading, onClick }: { isLoading: boolean; onClick: () => void }) => (
    <div className="flex justify-center">
        <Button
            size="lg"
            variant="outline"
            onClick={onClick}
            disabled={isLoading}
            isLoading={isLoading}
        >
            Load More Testimonials
        </Button>
    </div>
);

const TestimonialsGrid = ({
    title,
    testimonials,
    testimonialsPerPage = 6,
    className = "",
}: TestimonialsGridProps) => {
    const [displayCount, setDisplayCount] = useState(testimonialsPerPage);
    const [sortBy, setSortBy] = useState<"recent" | "rating">("recent");
    const [isLoading, setIsLoading] = useState(false);

    let filteredTestimonials = [...testimonials];

    filteredTestimonials.sort((a, b) => {
        if (sortBy === "rating") {
            return (b.rating || 0) - (a.rating || 0);
        }
        return new Date(b.date || "").getTime() - new Date(a.date || "").getTime();
    });

    const featuredTestimonials = filteredTestimonials.filter((t) => t.featured);
    const regularTestimonials = filteredTestimonials.filter((t) => !t.featured);
    const displayedTestimonials = regularTestimonials.slice(0, displayCount);
    const hasMore = displayCount < regularTestimonials.length;

    const loadMore = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));
        setDisplayCount((prev) => prev + testimonialsPerPage);
        setIsLoading(false);
    };

    return (
        <div className={`flex flex-col gap-12 ${className}`}>
            <SectionHeader title={title} />
            <SortControls sortBy={sortBy} onSortChange={setSortBy} />

            <div className="flex flex-col gap-12">
                {featuredTestimonials.length > 0 && (
                    <div className="grid gap-8 md:grid-cols-2">
                        {featuredTestimonials.map((testimonial, index) => (
                            <FeaturedTestimonialCard key={index} testimonial={testimonial} />
                        ))}
                    </div>
                )}

                <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
                    {displayedTestimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} />
                    ))}
                </div>

                {hasMore && <LoadMoreButton isLoading={isLoading} onClick={loadMore} />}

                <div className="text-center text-sm text-gray-500">
                    Showing {displayedTestimonials.length} of {regularTestimonials.length}{" "}
                    testimonials
                </div>
            </div>
        </div>
    );
};

export default TestimonialsGrid;
