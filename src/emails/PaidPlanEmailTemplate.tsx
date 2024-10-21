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
    Button,
    Link,
} from "@react-email/components";
import { TextConstants } from "@/constants/TextConstants";

interface PaidPlanEmailTemplateProps {
    userFirstName: string;
    purchasedPackage: string;
    companyTitle: string;
    gettingStartedLoomUrl: string;
    twitterCompanyUrl: string;
    twitterCompanyTag: string;
    twitterFounderUrl: string;
    twitterFounderTag: string;
}

export const PaidPlanEmailTemplate = ({
    userFirstName,
    purchasedPackage,
    companyTitle,
    gettingStartedLoomUrl,
    twitterCompanyUrl,
    twitterCompanyTag,
    twitterFounderUrl,
    twitterFounderTag,
}: PaidPlanEmailTemplateProps) => {
    const previewText = `Thank you for your order of ${purchasedPackage}!`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-neutral-200 rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src={process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL}
                                width="48"
                                height="48"
                                alt={companyTitle}
                                className="my-0 mx-auto"
                            />
                        </Section>
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            You're all set to go!
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hi {userFirstName},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Great news! Your transaction for <strong>{purchasedPackage}</strong> has
                            been successfully processed.
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px] mt-4">
                            To help you get the most out our product, I've created a quick video
                            walkthrough.
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px] mt-4">
                            It covers everything you need to know to hit the ground running with{" "}
                            {companyTitle}.
                        </Text>
                        <Button
                            className="bg-black rounded text-white text-[14px] font-semibold no-underline text-center w-full py-2.5 mb-3"
                            href={gettingStartedLoomUrl}
                        >
                            Watch the Getting Started Video
                        </Button>
                        <Text className="text-black text-[14px] leading-[24px]">
                            P.S.: This is sooo exciting! I'd love to hear about how you're using{" "}
                            {companyTitle}. Feel free to share it with me on Twitter! 😃
                        </Text>
                        <Text className="text-[14px] leading-[22px] mt-2">
                            Tag us{" "}
                            <Link href={twitterCompanyUrl} className="text-blue-500">
                                {twitterCompanyTag}
                            </Link>{" "}
                            or me, the founder,{" "}
                            <Link href={twitterFounderUrl} className="text-blue-500">
                                {twitterFounderTag}
                            </Link>
                        </Text>
                        <Hr className="border border-solid border-neutral-200 my-[26px] mx-0 w-full" />
                        <Text className="text-neutral-500 text-[12px] leading-[24px]">
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
PaidPlanEmailTemplate.PreviewProps = {
    userFirstName: "Sarah",
    purchasedPackage: "Premium Plan (20% off)",
    companyTitle: TextConstants.EMAIL__COMPANY_TITLE,
    gettingStartedLoomUrl: TextConstants.EMAIL__LOOM_GETTING_STARTED_URL,
    twitterCompanyUrl: TextConstants.EMAIL__TWITTER_COMPANY_URL,
    twitterCompanyTag: TextConstants.EMAIL__TWITTER_COMPANY_TAG,
    twitterFounderUrl: TextConstants.EMAIL__TWITTER_FOUNDER_URL,
    twitterFounderTag: TextConstants.TEXT__TWITTER_FOUNDER_TAG,
} as PaidPlanEmailTemplateProps;

export default PaidPlanEmailTemplate;
