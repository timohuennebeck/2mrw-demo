import Image from "next/image";
import QuoteImg from "@/assets/quotes.svg";

const FeaturedTestimonial = () => {
    return (
        <div className="mx-auto max-w-3xl text-center">
            <Image src={QuoteImg} alt="Quote" width={48} height={48} className="mx-auto mb-6" />

            <blockquote className="mb-8 text-2xl font-medium">
                "Thanks for building such an empowering tool, especially for designers! The site
                went from Figma to Framer in less than a week!"
            </blockquote>

            <div className="flex items-center justify-center gap-3">
                <Image
                    src="https://i.imgur.com/E6nCVLy.jpeg"
                    alt="Eva Elle"
                    width={40}
                    height={40}
                    className="h-12 w-12 rounded-full bg-gray-200"
                />
                <div className="text-left">
                    <div className="font-medium">Eva Elle</div>
                    <div className="text-sm text-gray-500">Marketing Director @BC</div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedTestimonial;
