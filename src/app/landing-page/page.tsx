"use client";

import Section from "@/components/ui/Section";
import BeforeAfter from "@/components/marketing/BeforeAfter";
import CTASection from "@/components/marketing/CTASection";
import DemoSection from "@/components/marketing/DemoSection";
import FAQ from "@/components/marketing/FAQ";
import Features from "@/components/marketing/Features";
import FeaturesList from "@/components/marketing/FeaturesList";
import FeaturedTestimonial from "@/components/marketing/FeatureTestimonial";
import Footer from "@/components/marketing/Footer";
import Header from "@/components/marketing/Header";
import HeroSection from "@/components/marketing/HeroSection";
import PricingComparison from "@/components/marketing/PricingComparison";
import PromoBanner from "@/components/marketing/PromoBanner";
import StatsSection from "@/components/marketing/StatsSection";
import TestimonialsGrid from "@/components/marketing/TestimonialsGrid";
import { Manrope } from "next/font/google";
import { authFeatures, databaseFeatures, emailFeatures } from "@/data/marketing/features";
import { featuresList } from "@/data/marketing/featuresList";
import { faqs } from "@/data/marketing/faqs";
import { testimonials } from "@/data/marketing/testimonials";
import { defaultPricingFeatures, defaultPricingPlans } from "@/data/marketing/pricing";
import { exampleStats } from "@/data/marketing/stats";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

const LandingPage = () => {
    return (
        <div className={`${manrope.variable} flex flex-col font-manrope`}>
            <div>
                <PromoBanner
                    text={{
                        desktop: "2mrw has just launched! Get 50% off with code",
                        mobile: "Get 50% off with code",
                        code: "LAUNCH50",
                    }}
                    link={{
                        href: "/pricing",
                        label: "Learn more",
                    }}
                    className="bg-black text-white"
                />
                <Header
                    navItems={[
                        { href: "/pricing", label: "Pricing" },
                        { href: "/features", label: "Features" },
                        { href: "/testimonials", label: "Testimonials" },
                        { href: "/faq", label: "FAQ" },
                        { href: "/changelog", label: "Changelog" },
                    ]}
                    logoSrc="https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg"
                    logoAlt="My Company"
                    loginHref="/signin"
                />
                <HeroSection
                    promoText="GET €30 OFF - 50 CODES LEFT"
                    title={
                        <>
                            Build Your MVP in a <span className="text-black">WEEKEND</span>, not
                            Months, with <span className="text-gray-400">Next.js and Supabase</span>
                        </>
                    }
                    subtitle="Launch in as little as 48 hours with this lightweight Next.js Supabase boilerplate that handles all the boring stuff such user authentication, stripe, etc."
                    primaryCTA={{
                        text: "Get Started Now",
                        href: "/get-started",
                    }}
                    secondaryCTA={{
                        text: "Watch Demo",
                        onClick: () => {},
                    }}
                    demoVideoUrl="https://framerusercontent.com/assets/hABzjRMXjNw1XA1si9W04jXifs.mp4"
                />
            </div>
            <div className="mx-auto mt-28 flex w-full max-w-7xl flex-col gap-36">
                <Section>
                    <FeaturedTestimonial
                        quote="Thanks for building such an empowering tool, especially for designers! The site went from Figma to Framer in less than a week!"
                        author={{
                            name: "Eva Elle",
                            role: "Marketing Director @BC",
                            imageUrl: "https://i.imgur.com/E6nCVLy.jpeg",
                        }}
                    />
                </Section>
                <Section>
                    <BeforeAfter
                        heading={{
                            eyebrow: "Compare",
                            title: "See the difference",
                            titleHighlight: "between before and after using our solution",
                            description:
                                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet aperiam voluptates totam fuga labore inventore.",
                        }}
                        before={{
                            title: "Without Our Solution",
                            bulletPoints: [
                                { text: "Manual process", isPositive: false },
                                { text: "Time consuming", isPositive: false },
                            ],
                            imagePath:
                                "https://framerusercontent.com/assets/hABzjRMXjNw1XA1si9W04jXifs.mp4",
                        }}
                        after={{
                            title: "With Our Solution",
                            bulletPoints: [
                                { text: "Automated process", isPositive: true },
                                { text: "Save hours of time", isPositive: true },
                            ],
                            imagePath:
                                "https://framerusercontent.com/assets/hABzjRMXjNw1XA1si9W04jXifs.mp4",
                        }}
                    />
                </Section>
                <Section>
                    <StatsSection
                        title="Your Custom Title"
                        subtitle="Custom Stats"
                        description="Your custom description goes here"
                        stats={exampleStats}
                    />
                </Section>
                <Section>
                    <FeaturedTestimonial
                        quote="Thanks for building such an empowering tool, especially for designers! The site went from Figma to Framer in less than a week!"
                        author={{
                            name: "Eva Elle",
                            role: "Marketing Director @BC",
                            imageUrl: "https://i.imgur.com/E6nCVLy.jpeg",
                        }}
                    />
                </Section>
                <Section>
                    <Features
                        features={authFeatures}
                        title="End-to-End Testing."
                        subtitle="Built-in test coverage ensuring reliable authentication, billing, and user flows."
                        badge={{
                            text: "E2E TESTS WITH CYPRESS",
                            bgColor: "bg-purple-50",
                            textColor: "text-purple-600",
                        }}
                        videoUrl="https://framerusercontent.com/assets/hABzjRMXjNw1XA1si9W04jXifs.mp4"
                    />
                </Section>
                <Section>
                    <Features
                        videoOnLeft
                        features={emailFeatures}
                        title="Emails."
                        subtitle="Built-in test coverage ensuring reliable authentication, billing, and user flows."
                        badge={{
                            text: "EMAILS WITH REACT EMAIL",
                            bgColor: "bg-blue-50",
                            textColor: "text-blue-600",
                        }}
                        videoUrl="https://framerusercontent.com/assets/hABzjRMXjNw1XA1si9W04jXifs.mp4"
                    />
                </Section>
                <Section>
                    <Features
                        features={databaseFeatures}
                        title="Database."
                        subtitle="Built-in test coverage ensuring reliable authentication, billing, and user flows."
                        badge={{
                            text: "DATABASE WITH SUPABASE",
                            bgColor: "bg-orange-50",
                            textColor: "text-orange-600",
                        }}
                        videoUrl="https://framerusercontent.com/assets/hABzjRMXjNw1XA1si9W04jXifs.mp4"
                    />
                </Section>
                <Section>
                    <FeaturedTestimonial
                        quote="Thanks for building such an empowering tool, especially for designers! The site went from Figma to Framer in less than a week!"
                        author={{
                            name: "Eva Elle",
                            role: "Marketing Director @BC",
                            imageUrl: "https://i.imgur.com/E6nCVLy.jpeg",
                        }}
                    />
                </Section>
                <Section>
                    <DemoSection
                        title="Experience 2mrw"
                        highlightedTitle="in 2 minutes"
                        subtitle="Launch in as little as 48 hours with this lightweight Next.js Supabase boilerplate that handles all the boring stuff such user authentication, stripe, etc."
                        videoUrl="https://framerusercontent.com/assets/hABzjRMXjNw1XA1si9W04jXifs.mp4"
                    />
                </Section>
                <Section>
                    <FeaturesList
                        heading="Your Custom Heading"
                        description="Your custom description text goes here."
                        features={featuresList}
                        sectionTitle="Optional Custom Section Title"
                    />
                </Section>
                <Section>
                    <PricingComparison
                        title="Choose Your Perfect Plan"
                        subtitle="Pricing Options"
                        description="Select the plan that best fits your needs."
                        plans={defaultPricingPlans}
                        features={defaultPricingFeatures}
                        buttonText="Start Now"
                        accentColor="indigo"
                    />
                </Section>
                <Section>
                    <FAQ
                        title="Custom Title"
                        subtitle="Support"
                        tagline="Find answers to common questions."
                        items={faqs}
                    />
                </Section>
                <Section>
                    <TestimonialsGrid
                        title={{
                            badge: "TRUSTED BY FOUNDERS",
                            main: "See what others are saying",
                            highlight: "about our platform",
                            subtitle:
                                "Join thousands of satisfied customers who trust our solution",
                        }}
                        testimonials={testimonials}
                        testimonialsPerPage={8}
                        className="my-12"
                    />
                </Section>
                <Section>
                    <CTASection
                        eyebrow="Special Offer"
                        title="Lock in €30 OFF Forever. Use 'Launch30' at checkout"
                        description="Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo do ea."
                        primaryButton={{
                            text: "Get started",
                            onClick: () => console.log("Primary button clicked"),
                        }}
                        secondaryButton={{
                            text: "Learn more",
                            onClick: () => console.log("Secondary button clicked"),
                        }}
                    />
                </Section>
                <Section>
                    <Footer />
                </Section>
            </div>
        </div>
    );
};

export default LandingPage;
