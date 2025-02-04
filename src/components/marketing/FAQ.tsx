"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQParams {
    title?: string;
    eyebrow?: string;
    tagline?: string;
    items: FAQItem[];
}

const FAQItem = ({
    faq,
    isOpen,
    onToggle,
    index,
}: {
    faq: FAQItem;
    isOpen: boolean;
    onToggle: () => void;
    index: number;
}) => (
    <div key={index} className="flex flex-col gap-3 py-6">
        <button onClick={onToggle} className="flex w-full items-start justify-between text-left">
            <span className="text-base font-medium text-foreground">{faq.question}</span>
            <span className="ml-6 flex h-7 items-center">
                <Plus
                    className={`h-6 w-6 transform text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-45" : ""
                    }`}
                />
            </span>
        </button>
        {isOpen && (
            <div className="pr-12">
                {faq.answer.split("\n").map((paragraph, i) => (
                    <p key={i} className="mb-4 text-base text-muted-foreground last:mb-0">
                        {paragraph}
                    </p>
                ))}
            </div>
        )}
    </div>
);

const FAQ = ({ title, eyebrow, tagline, items = [] }: FAQParams) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="grid grid-cols-1 gap-20 md:grid-cols-3">
            {/* Left Column - Title */}
            <div className="flex flex-col gap-4">
                {eyebrow && <p className="text-sm font-medium text-blue-600">{eyebrow}</p>}
                <h2 className="max-w-4xl text-4xl font-medium tracking-tight">{title}</h2>
                <p className="text-lg text-muted-foreground">{tagline}</p>
            </div>

            {/* Right Column - Questions */}
            <div className="md:col-span-2">
                <div className="divide-y divide-border">
                    {items.map((faq, index) => (
                        <FAQItem
                            key={index}
                            faq={faq}
                            index={index}
                            isOpen={openIndex === index}
                            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
