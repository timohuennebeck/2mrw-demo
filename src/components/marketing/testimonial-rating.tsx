"use client";

import Image from "next/image";
import { Star } from "lucide-react";

const TestimonialRating = () => {
    return (
        <div className="mb-16 flex items-center justify-center gap-4">
            <div className="flex">
                {[1, 2, 3, 4, 5].map((avatar) => (
                    <Image
                        key={avatar}
                        src="https://i.imgur.com/E6nCVLy.jpeg"
                        alt="User avatar"
                        width={32}
                        height={32}
                        className="-ml-2 h-12 w-12 rounded-full border-2 border-background bg-muted first:ml-0"
                    />
                ))}
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex flex-row">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 fill-foreground text-foreground" />
                    ))}
                </div>
                <span className="font-medium text-foreground">569 founders trust us</span>
            </div>
        </div>
    );
};

export default TestimonialRating;
