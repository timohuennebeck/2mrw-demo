import { Testimonial } from "@/components/marketing/TestimonialsGrid";

export const testimonials: Testimonial[] = [
    {
        content: {
            text: "This solution saved us countless hours of development time. We launched our MVP in just a weekend, something that would've taken months otherwise.",
            highlights: ["countless hours", "just a weekend"],
        },
        author: {
            name: "Sarah Chen",
            role: "CTO",
            company: "TechStart",
            image: "https://i.imgur.com/E6nCVLy.jpeg",
        },
        rating: 5,
        featured: true,
        date: "2024-03-15",
        verified: true,
    },
    {
        content: {
            text: "The authentication and payment integration worked flawlessly out of the box. This is exactly what early-stage startups need.",
            highlights: ["flawlessly", "out of the box"],
        },
        author: {
            name: "Michael Rodriguez",
            role: "Founder",
            company: "DevLabs",
            image: "https://i.imgur.com/E6nCVLy.jpeg",
        },
        rating: 5,
        date: "2024-03-10",
        verified: true,
    },
    {
        content: {
            text: "As a solo founder, this toolkit is invaluable. It handles all the complex infrastructure so I can focus on building my product.",
            highlights: ["invaluable", "focus on building"],
        },
        author: {
            name: "Emma Wilson",
            role: "Independent Developer",
            company: "Freelance",
            image: "https://i.imgur.com/E6nCVLy.jpeg",
        },
        rating: 5,
        date: "2024-03-08",
        verified: true,
    },
    {
        content: {
            text: "The email templates and Stripe integration saved me weeks of work.\nHighly recommend for any SaaS startup.",
            highlights: ["weeks of work"],
        },
        author: {
            name: "Alex Kumar",
            role: "Product Lead",
            company: "SaaSify",
            image: "https://i.imgur.com/E6nCVLy.jpeg",
        },
        rating: 4,
        date: "2024-03-05",
        verified: true,
    },
    {
        content: {
            text: "Clean code, great documentation, and excellent support.\nEverything you need to get started quickly.",
            highlights: ["excellent support", "started quickly"],
        },
        author: {
            name: "Lisa Thompson",
            role: "Senior Developer",
            company: "CodeCraft",
            image: "https://i.imgur.com/E6nCVLy.jpeg",
        },
        rating: 5,
        featured: true,
        date: "2024-03-01",
        verified: true,
    },
];
