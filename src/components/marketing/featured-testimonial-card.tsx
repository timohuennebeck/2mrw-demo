import QuoteImg from "@/assets/quotes-white.svg";
import Image from "next/image";
import { Testimonial } from "./testimonial-card";

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

        // replace newlines with <br /> tags
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

export default FeaturedTestimonialCard;
