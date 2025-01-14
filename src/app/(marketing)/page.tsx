"use client";

import logo from "@/assets/images/logo.svg";
import BeforeAfterComparison from "@/components/marketing/before-after-comparison";
import CallToAction from "@/components/marketing/call-to-action";
import FAQ from "@/components/marketing/faq";
import FeaturedTestimonial from "@/components/marketing/featured-testimonial";
import Features from "@/components/marketing/features";
import FeaturesList from "@/components/marketing/features-list";
import Footer from "@/components/marketing/footer";
import Header from "@/components/marketing/header";
import Hero from "@/components/marketing/hero";
import HowItWorks from "@/components/marketing/how-it-works";
import PricingComparison from "@/components/marketing/pricing-comparison";
import ProductDemo from "@/components/marketing/product-demo";
import PromoBanner from "@/components/marketing/promo-banner";
import Stats from "@/components/marketing/stats";
import TestimonialsGrid from "@/components/marketing/testimonials-grid";
import { useSession } from "@/context/SessionContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { faq } from "@/data/marketing/faq-data";
import { authFeatures, databaseFeatures, emailFeatures } from "@/data/marketing/features-data";
import { featuresList } from "@/data/marketing/features-list-data";
import { bottomLinks, footerLinks } from "@/data/marketing/footer-data";
import { exampleStats } from "@/data/marketing/stats-data";
import { testimonials } from "@/data/marketing/testimonials-data";
import { cn } from "@/lib/utils";
import { getFilteredPricingPlans } from "@/services/domain/pricingService";
import { handleSmoothScroll } from "@/utils/navigation";
import { Shield } from "lucide-react";
import { Manrope } from "next/font/google";
import { useRouter } from "next/navigation";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

interface SectionContainerParams {
    id?: string;
    className?: string;
    children: React.ReactNode;
}

const SectionContainer = ({ id, className, children }: SectionContainerParams) => {
    return (
        <div id={id} className={cn("px-8", className)}>
            {children}
        </div>
    );
};

const LandingPage = () => {
    const { authUser } = useSession();
    const { subscription } = useSubscription();

    const router = useRouter();

    return (
        <>
            <div className="fixed inset-0 -z-10 h-full w-full">
                <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            <div className={`${manrope.variable} flex flex-col font-manrope`}>
                {/* COPY TIP: Promo banners should create urgency and highlight clear value.
                    Use specific numbers, time limits, or exclusive offers. */}
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
                    logoSrc={logo}
                    loginOnClick={() => router.push("/auth/sign-in")}
                    userIsLoggedIn={!!authUser}
                />
                <div className="mx-auto my-12 flex w-full max-w-7xl flex-col gap-36">
                    {/* COPY TIP: Hero sections need a clear, compelling value proposition.
                    Focus on the customer's main pain point and how you solve it.
                    Keep it concise - aim for 6-12 words. */}
                    <SectionContainer>
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
                            demoVideoUrl="https://www.dropbox.com/scl/fi/crcmzz58px8rro2i5axv2/main-demo.mp4?rlkey=duxmf3k5wyss2wtt2trq9q7qo&st=z8p7y1tv&raw=1"
                        />
                    </SectionContainer>

                    {/* COPY TIP: Social proof should be specific and results-focused.
                        Include numbers, achievements, or concrete benefits the customer experienced. */}
                    <SectionContainer>
                        <FeaturedTestimonial
                            quote="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores amet possimus praesentium ea deleniti recusandae?"
                            author={{
                                name: "Timo Huennebeck",
                                role: "Founder @2MRW",
                                imageUrl: "https://i.imgur.com/E6nCVLy.jpeg",
                            }}
                        />
                    </SectionContainer>

                    <SectionContainer>
                        <HowItWorks
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
                            description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet aperiam voluptates totam fuga labore inventore."
                            steps={[
                                {
                                    number: 1,
                                    title: "Lorem ipsum dolor sit amet.",
                                    description:
                                        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet aperiam voluptates totam fuga labore inventore.",
                                    icon: Shield,
                                },
                                {
                                    number: 2,
                                    title: "Lorem ipsum dolor sit amet.",
                                    description:
                                        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet aperiam voluptates totam fuga labore inventore.",
                                    icon: Shield,
                                },
                                {
                                    number: 3,
                                    title: "Lorem ipsum dolor sit amet.",
                                    description:
                                        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet aperiam voluptates totam fuga labore inventore.",
                                    icon: Shield,
                                },
                            ]}
                            videoPaths={[
                                "https://www.dropbox.com/scl/fi/crcmzz58px8rro2i5axv2/main-demo.mp4?rlkey=duxmf3k5wyss2wtt2trq9q7qo&st=z8p7y1tv&raw=1",
                                "https://www.dropbox.com/scl/fi/gnskt6it1i6xtqh3b75yw/user-authentication.mp4?rlkey=dpfc9wrj035ulagzg59noifyb&st=wh5j07zu&raw=1",
                                "https://www.dropbox.com/scl/fi/crcmzz58px8rro2i5axv2/main-demo.mp4?rlkey=duxmf3k5wyss2wtt2trq9q7qo&st=z8p7y1tv&raw=1",
                            ]}
                        />
                    </SectionContainer>

                    {/* COPY TIP: When comparing with competitors, focus on your unique advantages.
                        Use concrete examples and avoid generic claims. */}
                    <SectionContainer>
                        <BeforeAfterComparison
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
                                videoUrl:
                                    "https://www.dropbox.com/scl/fi/crcmzz58px8rro2i5axv2/main-demo.mp4?rlkey=duxmf3k5wyss2wtt2trq9q7qo&st=z8p7y1tv&raw=1",
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
                                videoUrl:
                                    "https://www.dropbox.com/scl/fi/gnskt6it1i6xtqh3b75yw/user-authentication.mp4?rlkey=dpfc9wrj035ulagzg59noifyb&st=wh5j07zu&raw=1",
                            }}
                        />
                    </SectionContainer>

                    <SectionContainer>
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
                    </SectionContainer>

                    <section>
                        <FeaturedTestimonial
                            quote="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores amet possimus praesentium ea deleniti recusandae?"
                            author={{
                                name: "Timo Huennebeck",
                                role: "Founder @2MRW",
                                imageUrl: "https://i.imgur.com/E6nCVLy.jpeg",
                            }}
                        />
                    </section>

                    {/* COPY TIP: Features should focus on benefits, not just functionality.
                        Format: "Feature Name: What it does + Why it matters to the customer" */}
                    <SectionContainer id="features" className="flex flex-col gap-36">
                        <Features
                            features={authFeatures}
                            title="Lorem, ipsum."
                            subtitle="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                            badge={{
                                text: "CUSTOM BADGE TITLE",
                                bgColor: "bg-purple-50",
                                textColor: "text-purple-600",
                            }}
                            videoUrl="https://www.dropbox.com/scl/fi/crcmzz58px8rro2i5axv2/main-demo.mp4?rlkey=duxmf3k5wyss2wtt2trq9q7qo&st=z8p7y1tv&raw=1"
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
                            videoUrl="https://www.dropbox.com/scl/fi/gnskt6it1i6xtqh3b75yw/user-authentication.mp4?rlkey=dpfc9wrj035ulagzg59noifyb&st=wh5j07zu&raw=1"
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
                            videoUrl="https://www.dropbox.com/scl/fi/crcmzz58px8rro2i5axv2/main-demo.mp4?rlkey=duxmf3k5wyss2wtt2trq9q7qo&st=z8p7y1tv&raw=1"
                        />
                    </SectionContainer>

                    <SectionContainer>
                        <FeaturedTestimonial
                            quote="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores amet possimus praesentium ea deleniti recusandae?"
                            author={{
                                name: "Timo Huennebeck",
                                role: "Founder @2MRW",
                                imageUrl: "https://i.imgur.com/E6nCVLy.jpeg",
                            }}
                        />
                    </SectionContainer>

                    <SectionContainer id="product-demo">
                        <ProductDemo
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
                            subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                            videoUrl="https://www.dropbox.com/scl/fi/crcmzz58px8rro2i5axv2/main-demo.mp4?rlkey=duxmf3k5wyss2wtt2trq9q7qo&st=z8p7y1tv&raw=1"
                        />
                    </SectionContainer>

                    <SectionContainer>
                        <FeaturesList
                            eyebrow="Lorem, ipsum."
                            heading="Lorem ipsum dolor sit amet"
                            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                            features={featuresList}
                        />
                    </SectionContainer>

                    {/* COPY TIP: Pricing sections should emphasize value over cost.
                        Highlight what makes each tier unique and who it's best for. */}
                    <SectionContainer id="pricing">
                        <PricingComparison
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
                            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, similique."
                            plans={getFilteredPricingPlans()}
                            features={getFilteredPricingPlans().defaultPricingFeatures}
                            isUserLoggedIn={!!authUser}
                            currentPlanStripePriceId={subscription?.stripe_price_id ?? ""}
                        />
                    </SectionContainer>

                    {/* COPY TIP: FAQs should address real customer objections.
                        Use actual customer questions and mirror their language. */}
                    <SectionContainer id="faq">
                        <FAQ
                            eyebrow="Lorem, ipsum dolor."
                            title="Lorem ipsum dolor sit amet"
                            tagline="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
                            items={faq}
                        />
                    </SectionContainer>

                    <SectionContainer id="testimonials">
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
                        />
                    </SectionContainer>

                    {/* COPY TIP: CTAs should be action-oriented and create urgency.
                        Focus on what the customer gets, not what they have to do. */}
                    <SectionContainer>
                        <CallToAction
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
                    </SectionContainer>

                    {/* COPY TIP: Footer copy should build trust.
                        Include social proof, guarantees, or security certifications. */}
                    <SectionContainer>
                        <Footer
                            links={footerLinks}
                            logo={{
                                src: logo,
                                alt: "Logo",
                            }}
                            description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique optio molestiae exercitationem! Porro doloribus molestias rerum error inventore."
                            companyName="2mrw"
                            bottomLinks={bottomLinks}
                        />
                    </SectionContainer>
                </div>
            </div>
        </>
    );
};

export default LandingPage;
