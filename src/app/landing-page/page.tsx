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

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

const LandingPage = () => {
    return (
        <div className={`${manrope.variable} flex flex-col font-manrope`}>
            <div>
                <PromoBanner />
                <Header />
                <HeroSection />
            </div>
            <div className="mx-auto mt-28 flex w-full max-w-7xl flex-col gap-36">
                <Section>
                    <FeaturedTestimonial />
                </Section>
                <Section>
                    <BeforeAfter />
                </Section>
                <Section>
                    <StatsSection />
                </Section>
                <Section>
                    <FeaturedTestimonial />
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
                    <FeaturedTestimonial />
                </Section>
                <Section>
                    <DemoSection />
                </Section>
                <Section>
                    <FeaturesList />
                </Section>
                <Section>
                    <PricingComparison />
                </Section>
                <Section>
                    <FAQ />
                </Section>
                <Section>
                    <TestimonialsGrid />
                </Section>
                <Section>
                    <CTASection />
                </Section>
                <Section>
                    <Footer />
                </Section>
            </div>
        </div>
    );
};

export default LandingPage;
