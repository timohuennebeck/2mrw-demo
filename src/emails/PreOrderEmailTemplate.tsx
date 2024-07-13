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

interface PreOrderEmailTemplateProps {
    userFullName: string;
    purchasedPackage: string;
    estimatedLaunchDate: string;
    companyTitle: string;
    twitterFounderUrl: string;
    twitterFounderTag: string;
}

const logoUrl = process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL
    ? `https://${process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL}`
    : "https://i.imgur.com/e0cWC6I.png";

export const PreOrderEmailTemplate = ({
    userFullName,
    purchasedPackage,
    estimatedLaunchDate,
    companyTitle,
    twitterFounderUrl,
    twitterFounderTag,
}: PreOrderEmailTemplateProps) => {
    const previewText = `A personal thank you for pre-ordering the ${purchasedPackage} from us!`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-gray-200 rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src={logoUrl}
                                width="48"
                                height="48"
                                alt="Forj"
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
                            I know You're eager to get started, so here's what You can look forward
                            to:
                        </Text>
                        <Section className="ml-4">
                            <Text className="text-black text-[14px] leading-[24px]">
                                1. Every FridaY, You'll get exclusive insider updates from me,
                                sharing the latest developments, challenges, and victories.
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                2. I'm aiming to launch the <strong>{purchasedPackage}</strong> on{" "}
                                <strong>{estimatedLaunchDate}</strong>.
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                3. You'll get prioritY access when it launches, with a personal
                                email from me on how to get started.
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                4. You'll have a direct line to me for feedback and suggestions as
                                an earlY supporter. Feel free to reach out to me on Twitter at{" "}
                                <Link href={twitterFounderUrl} className="text-blue-500">
                                    {twitterFounderTag}
                                </Link>{" "}
                            </Text>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Thanks again for being one of the first adopters. I'm pouring mY heart
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
    userFullName: "Michael",
    purchasedPackage: "Standard Package",
    estimatedLaunchDate: "September 18th, 2024",
    companyTitle: "Forj",
    twitterFounderUrl: "www.x.com/timohuennebeck",
    twitterFounderTag: "@timohuennebeck",
} as PreOrderEmailTemplateProps;

export default PreOrderEmailTemplate;
