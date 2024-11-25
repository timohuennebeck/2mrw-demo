"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Loader, SearchIcon } from "lucide-react";
import QuoteImg from "@/assets/quotes-white.svg";

export interface Testimonial {
    content: {
        text: string;
        highlights?: string[];
    };
    author: {
        name: string;
        role: string;
        company: string;
        image: string;
    };
    rating?: number;
    featured?: boolean;
    date?: string;
    verified?: boolean;
}

interface TestimonialsGridProps {
    title?: {
        badge?: string;
        main: string;
        highlight?: string;
        subtitle?: string;
    };
    testimonials: Testimonial[];
    testimonialsPerPage?: number;
    className?: string;
}

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
    const renderContent = (content: Testimonial["content"]) => {
        if (typeof content === "string") return `"${content}"`;

        let result = content.text;
        content.highlights?.forEach((highlight) => {
            result = result.replace(
                highlight,
                `<span class="rounded-lg bg-blue-50 px-2 py-0.5 text-blue-600">${highlight}</span>`,
            );
        });

        // Replace newlines with <br /> tags
        result = result.replace(/\n/g, "<br />");

        return (
            <p
                className="text-lg text-gray-900"
                dangerouslySetInnerHTML={{ __html: `"${result}"` }}
            />
        );
    };

    return (
        <div className="break-inside-avoid rounded-lg border border-gray-200 p-8 flex flex-col gap-8 mb-8">
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    {testimonial.rating && (
                        <div className="flex gap-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                                <Star
                                    key={i}
                                    className="h-5 w-5 fill-current"
                                    fill="currentColor"
                                />
                            ))}
                        </div>
                    )}
                </div>
                <blockquote className="text-lg text-gray-900">
                    {renderContent(testimonial.content)}
                </blockquote>
            </div>
            <div className="flex flex-row gap-3">
                <Image
                    src={testimonial.author.image}
                    alt={testimonial.author.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full bg-gray-200"
                />
                <div className="flex flex-col gap-1">
                    <div className="font-medium">{testimonial.author.name}</div>
                    <div className="text-sm text-gray-500">
                        {testimonial.author.role} @{testimonial.author.company}
                    </div>
                    {testimonial.date && (
                        <span className="text-xs text-gray-400">
                            {new Date(testimonial.date).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const FeaturedTestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
    const renderContent = (content: Testimonial["content"]) => {
        if (typeof content === "string") return `"${content}"`;

        let result = content.text;
        content.highlights?.forEach((highlight) => {
            result = result.replace(
                highlight,
                `<span class="rounded-lg bg-white/80 px-2 py-0.5 text-gray-900">${highlight}</span>`,
            );
        });

        // Replace newlines with <br /> tags
        result = result.replace(/\n/g, "<br />");

        return (
            <p
                className="text-xl font-medium"
                dangerouslySetInnerHTML={{ __html: `"${result}"` }}
            />
        );
    };

    return (
        <div className="rounded-lg bg-black p-8 text-white">
            <div className="flex h-full flex-col gap-8">
                <div className="flex flex-col gap-8">
                    <Image src={QuoteImg} alt="Quote" width={48} height={48} />
                    <blockquote className="text-xl font-medium">
                        {renderContent(testimonial.content)}
                    </blockquote>
                </div>
                <div className="flex items-center gap-3">
                    <Image
                        src={testimonial.author.image}
                        alt={testimonial.author.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full bg-gray-800"
                    />
                    <div>
                        <div className="font-medium">{testimonial.author.name}</div>
                        <div className="text-sm text-gray-400">
                            {testimonial.author.role} @{testimonial.author.company}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TestimonialsGrid = ({
    title,
    testimonials,
    testimonialsPerPage = 6,
    className = "",
}: TestimonialsGridProps) => {
    const [displayCount, setDisplayCount] = useState(testimonialsPerPage);
    const [filterRating, setFilterRating] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"recent" | "rating">("recent");
    const [isLoading, setIsLoading] = useState(false);

    // Filter and sort testimonials
    let filteredTestimonials = testimonials.filter((testimonial) => {
        const matchesRating = filterRating ? testimonial.rating === filterRating : true;
        const matchesSearch = searchTerm
            ? testimonial.content.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
              testimonial.author.name.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
        return matchesRating && matchesSearch;
    });

    // Sort testimonials
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
            {/* Optional Section Header */}
            {title && (
                <div className="mx-auto text-center flex flex-col gap-6">
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
                    <h2 className="text-4xl font-medium tracking-tight md:text-5xl">
                        {title.main}{" "}
                        {title.highlight && (
                            <span className="text-gray-400">{title.highlight}</span>
                        )}
                    </h2>
                    {title.subtitle && (
                        <p className="text-lg text-gray-600">{title.subtitle}</p>
                    )}
                </div>
            )}

            {/* Filters & Search */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                {/* Rating Filters */}
                <div className="flex flex-wrap gap-2">
                    {[5, 4, 3].map((rating) => (
                        <button
                            key={rating}
                            onClick={() =>
                                setFilterRating(filterRating === rating ? null : rating)
                            }
                            className={`rounded-lg px-4 py-2 text-sm transition-colors ${
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

            {/* Testimonials Content */}
            <div className="flex flex-col gap-12">
                {/* Featured Testimonials */}
                {featuredTestimonials.length > 0 && (
                    <div className="grid gap-8 md:grid-cols-2">
                        {featuredTestimonials.map((testimonial, index) => (
                            <FeaturedTestimonialCard key={index} testimonial={testimonial} />
                        ))}
                    </div>
                )}

                {/* Regular Testimonials */}
                <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
                    {displayedTestimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} />
                    ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                    <div className="flex justify-center">
                        <button
                            onClick={loadMore}
                            disabled={isLoading}
                            className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Load More Testimonials"
                            )}
                        </button>
                    </div>
                )}

                {/* Testimonials Count */}
                <div className="text-center text-sm text-gray-500">
                    Showing {displayedTestimonials.length} of {regularTestimonials.length} testimonials
                </div>
            </div>
        </div>
    );
};

export default TestimonialsGrid;
