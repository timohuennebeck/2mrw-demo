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

const OnboardingEmail = ({ userFirstName, purchasedPackage }: PaidPlanEmailTemplateProps) => {
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
                            You just made my day, {userFirstName}! 😃
                        </Heading>

                        <Text className="text-[14px] leading-[24px] text-black">
                            I literally did a little happy dance when I saw you joined us! Thank you
                            for choosing the <strong>{purchasedPackage}</strong> package - you're
                            going to love what's in store.
                        </Text>

                        <Text className="text-[14px] leading-[24px] text-black">
                            I know you're probably excited to dive in (I would be too!), so I've put
                            together a quick 5-minute video showing you exactly how to get the most
                            out of {companyInformation.name}.
                        </Text>

                        <Button
                            className="my-6 w-full rounded bg-black py-2.5 text-center text-[14px] font-semibold text-white no-underline"
                            href={emailConfig.settings.onboardingEmail.gettingStartedLoomUrl}
                        >
                            SHOW ME THE GOOD STUFF →
                        </Button>

                        <Text className="text-[14px] leading-[24px] text-black">
                            Got questions? Don't be shy! I'd love to help you personally - just hit
                            reply to this email. Seriously, I read and respond to every message!
                        </Text>

                        <Text className="mt-4 text-[14px] leading-[24px] text-black">
                            Oh, and if you're on Twitter, come say hi! I'm at{" "}
                            <Link href={socialLinks.twitter.founder.url} className="text-blue-500">
                                {socialLinks.twitter.founder.tag}
                            </Link>
                            . I'd love to hear what made you decide to join us!
                        </Text>

                        <Hr className="mx-0 my-[26px] w-full border border-solid border-neutral-200" />

                        <Text className="text-[12px] leading-[24px] text-neutral-500">
                            Rooting for your success!
                            <br />
                            Timo
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

// enable this during development to preview what the email will look like
OnboardingEmail.PreviewProps = {
    userFirstName: "Sarah",
    purchasedPackage: "Premium Plan (20% off)",
} as PaidPlanEmailTemplateProps;

export default OnboardingEmail;
