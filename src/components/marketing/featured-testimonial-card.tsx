import QuoteImgWhite from "@/assets/quotes-white.svg";
import Image from "next/image";
import { Testimonial } from "./testimonial-card";
import { useTheme } from "next-themes";
import QuoteImgBlack from "@/assets/quotes-black.svg";

const FeaturedTestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
    const { theme } = useTheme();

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
                className="text-xl font-medium text-foreground"
                dangerouslySetInnerHTML={{ __html: `"${result}"` }}
            />
        );
    };

    return (
        <div className="rounded-lg border border-border bg-background p-8">
            <div className="flex h-full flex-col justify-between gap-8">
                <div className="flex flex-col gap-8">
                    <Image
                        src={theme === "dark" ? QuoteImgWhite : QuoteImgBlack}
                        alt="Quote"
                        width={48}
                        height={48}
                    />
                    <blockquote className="text-xl font-medium">
                        {renderContent(testimonial.content)}
                    </blockquote>
                </div>
                <div className="flex gap-3">
                    <Image
                        src={testimonial.author.image}
                        alt={testimonial.author.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full"
                    />
                    <div className="flex flex-col gap-1">
                        <div className="font-medium">{testimonial.author.name}</div>
                        <div className="text-sm text-muted-foreground">
                            {testimonial.author.role} @{testimonial.author.company}
                        </div>
                        {testimonial.date && (
                            <span className="text-xs text-muted-foreground">
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
        </div>
    );
};

export default FeaturedTestimonialCard;
