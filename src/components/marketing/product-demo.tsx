import React from "react";
import YoutubeVideo from "../ui/youtube-video";

interface ProductDemoParams {
    eyebrow?: string;
    title: React.ReactNode;
    subtitle: string;
    videoUrl: string;
}

const ProductDemo = ({ eyebrow, title, subtitle, videoUrl }: ProductDemoParams) => {
    return (
        <div className="flex flex-col items-center justify-center gap-10 text-center">
            <div className="flex flex-col gap-6">
                {eyebrow && <p className="text-sm font-medium text-blue-600">{eyebrow}</p>}
                {/* Main Title */}
                <h2 className="max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-5xl">
                    {title}
                </h2>

                {/* Subtitle */}
                <p className="max-w-3xl text-lg text-gray-600">{subtitle}</p>
            </div>

            {/* Demo Video */}
            <div className="relative w-full max-w-5xl">
                <YoutubeVideo src={videoUrl} />
            </div>
        </div>
    );
};

export default ProductDemo;
