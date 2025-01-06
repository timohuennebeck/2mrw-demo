import React from "react";

interface ProductDemoParams {
    title: React.ReactNode;
    subtitle: string;
    videoUrl: string;
}

const ProductDemo = ({ title, subtitle, videoUrl }: ProductDemoParams) => {
    return (
        <div className="flex flex-col items-center justify-center gap-10 text-center">
            <div className="flex flex-col gap-6">
                {/* Main Title */}
                <h2 className="max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-5xl">
                    {title}
                </h2>

                {/* Subtitle */}
                <p className="max-w-3xl text-lg text-gray-600">{subtitle}</p>
            </div>

            {/* Demo Video */}
            <div className="relative w-full max-w-5xl">
                <video
                    src={videoUrl}
                    width={1200}
                    height={675}
                    className="rounded-lg shadow-2xl"
                    autoPlay
                    muted
                    loop
                />
            </div>
        </div>
    );
};

export default ProductDemo;
