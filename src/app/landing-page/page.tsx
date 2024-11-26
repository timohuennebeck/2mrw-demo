"use client";

import Section from "@/components/ui/Section";
import BeforeAfter from "@/components/marketing/BeforeAfter";
import FAQ from "@/components/marketing/FAQ";
import Features from "@/components/marketing/Features";
import FeaturesList from "@/components/marketing/FeaturesList";
import FeaturedTestimonial from "@/components/marketing/FeaturedTestimonial";
import Footer from "@/components/marketing/Footer";
import Header from "@/components/marketing/Header";
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
import { footerLinks } from "@/data/marketing/footer";
import Hero from "@/components/marketing/Hero";
import ProductDemo from "@/components/marketing/ProductDemo";
import CTA from "@/components/marketing/CTA";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

const LandingPage = () => {
    return (
        <>
            <div className="fixed inset-0 -z-10 h-full w-full">
                <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            <div className={`${manrope.variable} flex flex-col font-manrope`}>
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
                        { href: "#features", label: "Features" },
                        { href: "#pricing", label: "Pricing" },
                        { href: "#testimonials", label: "Testimonials" },
                        { href: "#faq", label: "FAQ" },
                        { href: "https://docs.2mrw.dev", label: "Documentation", isExternal: true },
                    ]}
                    logoSrc="https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg"
                    logoAlt="My Company"
                    loginHref="/signin"
                />
                <Hero
                    promoText="GET €30 OFF - 50 CODES LEFT"
                    title={
                        <>
                            Build Your MVP in a WEEKEND, not Months, with{" "}
                            <span className="relative mt-4 inline-block rotate-2 whitespace-nowrap bg-blue-600 p-2 text-white">
                                Next.js and Supabase
                            </span>
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

                <div className="mx-auto mb-8 mt-28 flex w-full max-w-7xl flex-col gap-36">
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
                                bulletPoints: [
                                    {
                                        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                                    },
                                    {
                                        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                                    },
                                    {
                                        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                                    },
                                    {
                                        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                                    },
                                    {
                                        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                                    },
                                ],
                                imagePath:
                                    "https://framerusercontent.com/assets/hABzjRMXjNw1XA1si9W04jXifs.mp4",
                            }}
                            after={{
                                bulletPoints: [
                                    {
                                        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                                    },
                                    {
                                        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                                    },
                                    {
                                        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                                    },
                                    {
                                        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                                    },
                                    {
                                        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                                    },
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

                    <Section id="features" className="flex flex-col gap-36">
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
                        <ProductDemo
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

                    <Section id="pricing">
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

                    <Section id="faq">
                        <FAQ
                            title="Custom Title"
                            subtitle="Support"
                            tagline="Find answers to common questions."
                            items={faqs}
                        />
                    </Section>

                    <Section id="testimonials">
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
                        <CTA
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
                        <Footer
                            links={footerLinks}
                            logo={{
                                src: "https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg",
                                alt: "Logo",
                            }}
                            description="Your company description here"
                            companyName="2mrw"
                            bottomLinks={[
                                { name: "Terms and Conditions", href: "/privacy" },
                                { name: "Changelog", href: "/changelog" },
                            ]}
                        />
                    </Section>
                </div>
            </div>
        </>
    );
};

export default LandingPage;
