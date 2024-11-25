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
import LogoCloud from "@/components/marketing/LogoClouds";
import PricingComparison from "@/components/marketing/PricingComparison";
import PromoBanner from "@/components/marketing/PromoBanner";
import StatsSection from "@/components/marketing/StatsSection";
import TestimonialsGrid from "@/components/marketing/TestimonialsGrid";
import { Manrope } from "next/font/google";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

const LandingPage = () => {
    return (
        <div className={`${manrope.variable} flex flex-col gap-20 font-manrope`}>
            <div>
                <PromoBanner />
                <Header />
                <HeroSection />
            </div>
            <LogoCloud />
            <StatsSection />
            <FeaturedTestimonial />
            <BeforeAfter />
            <FeaturedTestimonial />
            <Features />
            <Features isRight />
            <FeaturedTestimonial />
            <DemoSection />
            <FeaturesList />
            <PricingComparison />
            <FAQ />
            <TestimonialsGrid />
            <CTASection />
            <Footer />
        </div>
    );
};

export default LandingPage;
