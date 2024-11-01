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
import { emailConfig } from "@/config/emailConfig";

interface PaidPlanEmailTemplateProps {
    userFirstName: string;
    purchasedPackage: string;
}

export const PaidPlanEmailTemplate = ({
    userFirstName,
    purchasedPackage,
}: PaidPlanEmailTemplateProps) => {
    const { companyInformation, socialLinks } = emailConfig;

    const previewText = `Thank you for your order of ${purchasedPackage}!`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="mx-auto my-auto bg-white px-2 font-sans">
                    <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-neutral-200 p-[20px]">
                        <Section className="mt-[32px]">
                            <Img
                                src={companyInformation.logoUrl}
                                width="48"
                                height="48"
                                alt={companyInformation.name}
                                className="mx-auto my-0"
                            />
                        </Section>
                        <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
                            You're all set to go!
                        </Heading>
                        <Text className="text-[14px] leading-[24px] text-black">
                            Hi {userFirstName},
                        </Text>
                        <Text className="text-[14px] leading-[24px] text-black">
                            Great news! Your transaction for <strong>{purchasedPackage}</strong> has
                            been successfully processed.
                        </Text>
                        <Text className="mt-4 text-[14px] leading-[24px] text-black">
                            To help you get the most out our product, I've created a quick video
                            walkthrough.
                        </Text>
                        <Text className="mt-4 text-[14px] leading-[24px] text-black">
                            It covers everything you need to know to hit the ground running with{" "}
                            {companyInformation.name}.
                        </Text>
                        {/* <Button
                            className="mb-3 w-full rounded bg-black py-2.5 text-center text-[14px] font-semibold text-white no-underline"
                            href={emailConfig.gettingStartedLoomUrl}
                        >
                            Watch the Getting Started Video
                        </Button> */}
                        <Text className="text-[14px] leading-[24px] text-black">
                            P.S.: This is sooo exciting! I'd love to hear about how you're using{" "}
                            {companyInformation.name}. Feel free to share it with me on Twitter! 😃
                        </Text>
                        <Text className="mt-2 text-[14px] leading-[22px]">
                            Tag us{" "}
                            <Link href={socialLinks.twitter.company.url} className="text-blue-500">
                                {socialLinks.twitter.company.tag}
                            </Link>{" "}
                            or me, the founder,{" "}
                            <Link href={socialLinks.twitter.founder.url} className="text-blue-500">
                                {socialLinks.twitter.founder.tag}
                            </Link>
                        </Text>
                        <Hr className="mx-0 my-[26px] w-full border border-solid border-neutral-200" />
                        <Text className="text-[12px] leading-[24px] text-neutral-500">
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
} as PaidPlanEmailTemplateProps;

export default PaidPlanEmailTemplate;
