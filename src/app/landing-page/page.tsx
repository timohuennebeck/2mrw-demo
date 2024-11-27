"use client";

import CompetitorComparison from "@/components/marketing/CompetitorComparison";
import CTA from "@/components/marketing/CTA";
import FAQ from "@/components/marketing/FAQ";
import FeaturedTestimonial from "@/components/marketing/FeaturedTestimonial";
import Features from "@/components/marketing/Features";
import FeaturesList from "@/components/marketing/FeaturesList";
import Footer from "@/components/marketing/Footer";
import Header from "@/components/marketing/Header";
import Hero from "@/components/marketing/Hero";
import PricingComparison from "@/components/marketing/PricingComparison";
import ProductDemo from "@/components/marketing/ProductDemo";
import PromoBanner from "@/components/marketing/PromoBanner";
import Stats from "@/components/marketing/Stats";
import TestimonialsGrid from "@/components/marketing/TestimonialsGrid";
import Section from "@/components/ui/Section";
import { faq } from "@/data/marketing/faq-data";
import { authFeatures, databaseFeatures, emailFeatures } from "@/data/marketing/features-data";
import { featuresList } from "@/data/marketing/features-list-data";
import { footerLinks } from "@/data/marketing/footer-data";
import { defaultPricingFeatures, defaultPricingPlans } from "@/data/marketing/pricing-data";
import { exampleStats } from "@/data/marketing/stats-data";
import { testimonials } from "@/data/marketing/testimonials-data";
import { handleSmoothScroll } from "@/utils/navigation";
import { Manrope } from "next/font/google";

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
                        desktop: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
                        mobile: "Lorem ipsum dolor",
                        code: "LOREM50",
                    }}
                    link={{
                        href: "/pricing",
                        label: "Lorem ipsum",
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
                    loginOnClick={() => {}}
                />
                <Hero
                    promoText="LOREM IPSUM DOLOR SIT AMET"
                    title={
                        <>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit.{" "}
                            <span className="relative mt-4 inline-block rotate-2 whitespace-nowrap bg-blue-600 p-2 text-white">
                                Lorem, ipsum.
                            </span>
                        </>
                    }
                    subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, saepe dicta eligendi praesentium accusamus cupiditate?"
                    primaryCTA={{
                        text: "Get Started Now",
                        onClick: (e) => handleSmoothScroll(e, "#pricing"),
                    }}
                    secondaryCTA={{
                        text: "Watch Demo",
                        onClick: (e) => handleSmoothScroll(e, "#product-demo"),
                    }}
                    demoVideoUrl="https://framerusercontent.com/assets/hABzjRMXjNw1XA1si9W04jXifs.mp4"
                />

                <div className="mx-auto mb-8 mt-28 flex w-full max-w-7xl flex-col gap-36">
                    <Section>
                        <FeaturedTestimonial
                            quote="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores amet possimus praesentium ea deleniti recusandae?"
                            author={{
                                name: "Timo Huennebeck",
                                role: "Founder @2MRW",
                                imageUrl: "https://i.imgur.com/E6nCVLy.jpeg",
                            }}
                        />
                    </Section>

                    <Section>
                        <CompetitorComparison
                            heading={{
                                eyebrow: "Lorem, ipsum dolor.",
                                title: (
                                    <>
                                        Lorem ipsum dolor sit{" "}
                                        <span className="relative mt-4 inline-block whitespace-nowrap bg-blue-600 p-2 text-white">
                                            amet consectetur,
                                        </span>
                                        adipisicing elit.
                                    </>
                                ),
                                description:
                                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet aperiam voluptates totam fuga labore inventore.",
                            }}
                            before={{
                                bulletPoints: [
                                    {
                                        text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
                                    },
                                    {
                                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                    },
                                    {
                                        text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam.",
                                    },
                                    {
                                        text: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit.",
                                    },
                                ],
                                imagePath:
                                    "https://framerusercontent.com/assets/hABzjRMXjNw1XA1si9W04jXifs.mp4",
                            }}
                            after={{
                                bulletPoints: [
                                    {
                                        text: "Excepteur sint occaecat cupidatat non proident sunt in culpa.",
                                    },
                                    {
                                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                    },
                                    {
                                        text: "Temporibus autem quibusdam et aut officiis debitis aut rerum.",
                                    },
                                    {
                                        text: "Itaque earum rerum hic tenetur a sapiente delectus ut aut.",
                                    },
                                ],
                                imagePath:
                                    "https://framerusercontent.com/assets/hABzjRMXjNw1XA1si9W04jXifs.mp4",
                            }}
                        />
                    </Section>

                    <Section>
                        <Stats
                            eyebrow="Lorem, ipsum dolor."
                            title={
                                <>
                                    Lorem ipsum dolor sit{" "}
                                    <span className="relative mt-4 inline-block whitespace-nowrap bg-blue-600 p-2 text-white">
                                        amet consectetur,
                                    </span>
                                    adipisicing elit.
                                </>
                            }
                            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                            stats={exampleStats}
                        />
                    </Section>

                    <Section>
                        <FeaturedTestimonial
                            quote="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores amet possimus praesentium ea deleniti recusandae?"
                            author={{
                                name: "Timo Huennebeck",
                                role: "Founder @2MRW",
                                imageUrl: "https://i.imgur.com/E6nCVLy.jpeg",
                            }}
                        />
                    </Section>

                    <Section id="features" className="flex flex-col gap-36">
                        <Features
                            features={authFeatures}
                            title="Lorem, ipsum."
                            subtitle="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                            badge={{
                                text: "CUSTOM BADGE TITLE",
                                bgColor: "bg-purple-50",
                                textColor: "text-purple-600",
                            }}
                            videoUrl="https://framerusercontent.com/assets/hABzjRMXjNw1XA1si9W04jXifs.mp4"
                        />
                        <Features
                            videoOnLeft
                            features={emailFeatures}
                            title="Lorem, ipsum."
                            subtitle="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                            badge={{
                                text: "CUSTOM BADGE TITLE",
                                bgColor: "bg-blue-50",
                                textColor: "text-blue-600",
                            }}
                            videoUrl="https://framerusercontent.com/assets/hABzjRMXjNw1XA1si9W04jXifs.mp4"
                        />

                        <Features
                            features={databaseFeatures}
                            title="Lorem, ipsum."
                            subtitle="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                            badge={{
                                text: "CUSTOM BADGE TITLE",
                                bgColor: "bg-orange-50",
                                textColor: "text-orange-600",
                            }}
                            videoUrl="https://framerusercontent.com/assets/hABzjRMXjNw1XA1si9W04jXifs.mp4"
                        />
                    </Section>

                    <Section>
                        <FeaturedTestimonial
                            quote="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores amet possimus praesentium ea deleniti recusandae?"
                            author={{
                                name: "Timo Huennebeck",
                                role: "Founder @2MRW",
                                imageUrl: "https://i.imgur.com/E6nCVLy.jpeg",
                            }}
                        />
                    </Section>

                    <Section id="product-demo">
                        <ProductDemo
                            title={
                                <>
                                    Lorem ipsum dolor sit{" "}
                                    <span className="relative mt-4 inline-block whitespace-nowrap bg-blue-600 p-2 text-white">
                                        amet consectetur,
                                    </span>
                                    adipisicing elit.
                                </>
                            }
                            subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                            videoUrl="https://framerusercontent.com/assets/hABzjRMXjNw1XA1si9W04jXifs.mp4"
                        />
                    </Section>

                    <Section>
                        <FeaturesList
                            heading="Lorem ipsum dolor sit amet"
                            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                            features={featuresList}
                            sectionTitle="Lorem, ipsum dolor."
                        />
                    </Section>

                    <Section id="pricing">
                        <PricingComparison
                            title={
                                <>
                                    Lorem ipsum dolor sit{" "}
                                    <span className="relative mt-4 inline-block whitespace-nowrap bg-blue-600 p-2 text-white">
                                        amet consectetur,
                                    </span>
                                    adipisicing elit.
                                </>
                            }
                            subtitle="Lorem, ipsum dolor."
                            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, similique."
                            plans={defaultPricingPlans}
                            features={defaultPricingFeatures}
                            buttonText="Start Now"
                        />
                    </Section>

                    <Section id="faq">
                        <FAQ
                            eyebrow="Lorem, ipsum dolor."
                            title="Lorem ipsum dolor sit amet"
                            tagline="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
                            items={faq}
                        />
                    </Section>

                    <Section id="testimonials">
                        <TestimonialsGrid
                            title={{
                                badge: "CUSTOM BADGE TITLE",
                                main: (
                                    <>
                                        Lorem ipsum dolor sit{" "}
                                        <span className="relative mt-4 inline-block whitespace-nowrap bg-blue-600 p-2 text-white">
                                            amet consectetur,
                                        </span>
                                        adipisicing elit.
                                    </>
                                ),
                                subtitle:
                                    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cupiditate, odio!",
                            }}
                            testimonials={testimonials}
                            testimonialsPerPage={8}
                            className="my-12"
                        />
                    </Section>

                    <Section>
                        <CTA
                            eyebrow="Lorem, ipsum dolor."
                            title={
                                <>
                                    Lorem ipsum dolor sit{" "}
                                    <span className="relative mt-4 inline-block whitespace-nowrap bg-blue-600 p-2 text-white">
                                        amet consectetur,
                                    </span>
                                    adipisicing elit.
                                </>
                            }
                            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis veniam accusantium reprehenderit exercitationem eum deleniti?"
                            primaryButton={{
                                text: "Get started",
                                onClick: (e) => handleSmoothScroll(e, "#pricing"),
                            }}
                            secondaryButton={{
                                text: "Learn more",
                                onClick: (e) => handleSmoothScroll(e, "#features"),
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
                            description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique optio molestiae exercitationem! Porro doloribus molestias rerum error inventore."
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
