"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
    {
        question: "I'm interested but what will I get with this boilerplate?",
        answer: "You'll get a complete Next.js starter kit with authentication, database setup, API routes, payment integration, and essential UI components.",
    },
    {
        question: "I've seen other boilerplates. How is this one different?",
        answer: "Our boilerplate focuses on rapid MVP development with production-ready features out of the box. It includes Stripe integration, user authentication, and database setup - all preconfigured and ready to go.",
    },
    {
        question: "Besides the boilerplate, will there be other costs I should know about?",
        answer: "The only additional costs would be your hosting provider (like Vercel) and any third-party services you choose to use (like Stripe for payments or Supabase for database).",
    },
    {
        question: "I see it's build on Supabase. Can I use something else?",
        answer: "While the boilerplate is optimized for Supabase, the architecture is modular. You can swap out Supabase for alternatives like Firebase or a custom solution.",
    },
    {
        question: "I'm new to this. Is there documentation to help me?",
        answer: "Yes! We provide comprehensive documentation, video tutorials, and code comments. Plus, you get access to our community Discord for support.",
    },
    {
        question: "I'm thinking of purchasing the boilerplate. How long until I get access?",
        answer: "You'll get immediate access after purchase. All files and documentation will be available for instant download.",
    },
    {
        question: "How often is the repo updated?",
        answer: "We push updates weekly, including new features, security patches, and dependency updates. All updates are free for 12 months after purchase.",
    },
    {
        question:
            "I love the basic version, but need more features. How do I upgrade after purchasing?",
        answer: "You can upgrade to the premium version at any time. We'll deduct your initial purchase price from the upgrade cost.",
    },
    {
        question: "I'm still a bit unsure. Is it possible to get a refund if I don't like it?",
        answer: "Yes, we offer a 14-day money-back guarantee. No questions asked.",
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-20 md:grid-cols-3">
                    {/* Left Column - Title */}
                    <div className="flex flex-col gap-4">
                        <p className="text-sm font-medium text-blue-600">FAQ</p>
                        <h2 className="text-4xl font-medium tracking-tight">
                            Your questions answered.
                        </h2>
                        <p className="text-lg text-gray-600">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Est magni
                            similique, in cum architecto voluptatibus?
                        </p>
                    </div>

                    {/* Right Column - Questions */}
                    <div className="md:col-span-2">
                        <div className="divide-y divide-gray-200">
                            {faqs.map((faq, index) => (
                                <div key={index} className="flex flex-col gap-3 py-6">
                                    <button
                                        onClick={() =>
                                            setOpenIndex(openIndex === index ? null : index)
                                        }
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
            </div>
        </section>
    );
};

export default FAQ;
