import React from "react";
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Tailwind,
    Link,
} from "@react-email/components";
import { TextConstants } from "@/constants/TextConstants";

interface PreOrderEmailTemplateProps {
    userFullName: string;
    purchasedPackage: string;
    estimatedLaunchDate: string;
    companyTitle: string;
    twitterFounderUrl: string;
    twitterFounderTag: string;
}

export const PreOrderEmailTemplate = ({
    userFullName,
    purchasedPackage,
    estimatedLaunchDate,
    companyTitle,
    twitterFounderUrl,
    twitterFounderTag,
}: PreOrderEmailTemplateProps) => {
    const previewText = `Thank You for pre-ordering the ${purchasedPackage}!`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-gray-200 rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src={process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL}
                                width="48"
                                height="48"
                                alt="Logo"
                                className="my-0 mx-auto"
                            />
                        </Section>
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Thaaaaank You!
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hi {userFullName},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            This is Timo, the founder of {companyTitle}. Thank You so much for
                            pre-ordering the <strong>{purchasedPackage}</strong>. You're awesome! 😃
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            I know you're eager to get started, so here's what you can look forward
                            to:
                        </Text>
                        <Section className="ml-4">
                            <Text className="text-black text-[14px] leading-[24px]">
                                1. Every Friday, you'll get exclusive insider updates from me,
                                sharing the latest developments, challenges, and victories.
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                2. I'm aiming to launch the <strong>{purchasedPackage}</strong> on{" "}
                                <strong>{estimatedLaunchDate}</strong>.
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                3. You'll get priority access when it launches, with a personal
                                email from me on how to get started.
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                4. You'll have a direct line to me for feedback and suggestions as
                                an early supporter. Feel free to reach out to me on Twitter at{" "}
                                <Link href={twitterFounderUrl} className="text-blue-500">
                                    {twitterFounderTag}
                                </Link>{" "}
                            </Text>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Thanks again for being one of the first adopters. I'm pouring my heart
                            into making {companyTitle} exceptional 🤩
                        </Text>
                        <Hr className="border border-solid border-gray-200 my-[26px] mx-0 w-full" />
                        <Text className="text-gray-500 text-[12px] leading-[24px]">
                            Much love,
                            <br />
                            Timo Hünnebeck
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

// enable this during development to preview what the email will look like

PreOrderEmailTemplate.PreviewProps = {
    userFullName: "Sarah",
    purchasedPackage: "Premium Plan (20% off)",
    estimatedLaunchDate: TextConstants.TEXT__ESTIMATED_LAUNCH_DATE,
    companyTitle: TextConstants.TEXT__COMPANY_TITLE,
    twitterFounderUrl: TextConstants.TEXT__TWITTER_FOUNDER_URL,
    twitterFounderTag: TextConstants.TEXT__TWITTER_FOUNDER_TAG,
} as PreOrderEmailTemplateProps;

export default PreOrderEmailTemplate;
