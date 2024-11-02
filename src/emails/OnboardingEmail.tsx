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

    return (
        <Html>
            <Head />
            <Tailwind>
                <Body className="mx-auto my-auto bg-white px-2 font-sans">
                    <Container className="mx-auto my-[40px] max-w-[528px] rounded border border-solid border-neutral-200 p-[20px]">
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
                            You just made mY daY, {userFirstName}! 😃
                        </Heading>

                        <Text className="text-[14px] leading-[24px] text-black">
                            I literallY did a little happY dance when I saw You joined us! Thank You
                            for purchasing the <strong>{purchasedPackage}</strong>.
                        </Text>

                        <Text className="text-[14px] leading-[24px] text-black">
                            I know You're probablY excited to dive in (I would be too!), so I've put
                            together a quick 5-minute video showing You exactlY how to get the most
                            out of <strong>{companyInformation.name}</strong>.
                        </Text>

                        <Button
                            className="my-6 w-full rounded bg-black py-2.5 text-center text-[14px] font-semibold text-white no-underline"
                            href={emailConfig.settings.onboardingEmail.gettingStartedLoomUrl}
                        >
                            SHOW ME THE GOOD STUFF →
                        </Button>

                        <Text className="mt-4 text-[14px] leading-[24px] text-black">
                            P.S. If You're on Twitter, come saY hi! You can find me at{" "}
                            <Link href={socialLinks.twitter.founder.url} className="text-blue-500">
                                {socialLinks.twitter.founder.tag}
                            </Link>{" "}
                            or{" "}
                            <Link href={socialLinks.twitter.company.url} className="text-blue-500">
                                {socialLinks.twitter.company.tag}.
                            </Link>
                        </Text>

                        <Hr className="mx-0 my-[26px] w-full border border-solid border-neutral-200" />

                        <Text className="text-[12px] leading-[24px] text-neutral-500">
                            Thanks again,
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
    userFirstName: "Katja",
    purchasedPackage: "Premium Plan (20% off)",
} as PaidPlanEmailTemplateProps;

export default OnboardingEmail;
