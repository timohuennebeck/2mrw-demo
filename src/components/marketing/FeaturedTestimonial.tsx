import Image from "next/image";
import QuoteImg from "@/assets/quotes-black.svg";

interface FeaturedTestimonialParams {
    quote: string;
    author: {
        name: string;
        role: string;
        imageUrl: string;
    };
}

const FeaturedTestimonial = ({ quote, author }: FeaturedTestimonialParams) => {
    return (
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <Image src={QuoteImg} alt="Quote" width={48} height={48} />

            <blockquote className="text-2xl font-medium">"{quote}"</blockquote>

            <div className="flex items-center justify-center gap-3">
                <Image
                    src={author.imageUrl}
                    alt={author.name}
                    width={40}
                    height={40}
                    className="h-12 w-12 rounded-full bg-gray-200"
                />
                <div className="text-left">
                    <div className="font-medium">{author.name}</div>
                    <div className="text-sm text-gray-500">{author.role}</div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedTestimonial;
