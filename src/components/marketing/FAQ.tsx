"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQProps {
    title?: string;
    eyebrow?: string;
    tagline?: string;
    items: FAQItem[];
}

const FAQ = ({
    title = "Your questions answered.",
    eyebrow = "FAQ",
    tagline = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est magni similique, in cum architecto voluptatibus?",
    items = [],
}: FAQProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="grid grid-cols-1 gap-20 md:grid-cols-3">
            {/* Left Column - Title */}
            <div className="flex flex-col gap-4">
                <p className="text-sm font-medium text-blue-600">{eyebrow}</p>
                <h2 className="text-4xl font-medium tracking-tight">{title}</h2>
                <p className="text-lg text-gray-600">{tagline}</p>
            </div>

            {/* Right Column - Questions */}
            <div className="md:col-span-2">
                <div className="divide-y divide-gray-200">
                    {items.map((faq, index) => (
                        <div key={index} className="flex flex-col gap-3 py-6">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="flex w-full items-start justify-between text-left"
                            >
                                <span className="text-base font-medium text-gray-900">
                                    {faq.question}
                                </span>
                                <span className="ml-6 flex h-7 items-center">
                                    <Plus
                                        className={`h-6 w-6 transform text-gray-400 transition-transform duration-200 ${
                                            openIndex === index ? "rotate-45" : ""
                                        }`}
                                    />
                                </span>
                            </button>
                            {openIndex === index && (
                                <div className="pr-12">
                                    <p className="text-base text-gray-600">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
