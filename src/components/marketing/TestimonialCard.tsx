import { Star } from "lucide-react";
import Image from "next/image";

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

        // replace newlines with <br /> tags
        result = result.replace(/\n/g, "<br />");

        return (
            <p
                className="text-lg text-gray-900"
                dangerouslySetInnerHTML={{ __html: `"${result}"` }}
            />
        );
    };

    return (
        <div className="mb-8 flex break-inside-avoid flex-col gap-8 rounded-lg border border-gray-200 bg-white p-8">
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

export default TestimonialCard;
