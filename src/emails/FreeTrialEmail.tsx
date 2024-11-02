import React from "react";
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Section,
    Text,
    Tailwind,
    Link,
} from "@react-email/components";
import { emailConfig } from "@/config/emailConfig";

interface FreeTrialEmailTemplateProps {
    userFirstName: string;
    freeTrialEndDate: string;
}

const FreeTrialEmail = ({ userFirstName, freeTrialEndDate }: FreeTrialEmailTemplateProps) => {
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
                            You're in, {userFirstName}! 🌟
                        </Heading>
                        <Text className="text-[14px] leading-[24px] text-black">
                            I'm thrilled You've decided to give {companyInformation.name} a trY!
                            Your free trial is now active and will run until{" "}
                            <strong>{freeTrialEndDate}</strong>.
                        </Text>
                        <Text className="text-[14px] leading-[24px] text-black">
                            Don't worrY - I'll send You a reminder{" "}
                            <strong>2 daYs before Your free trial ends</strong> so You can decide if
                            You'd like to continue with a full subscription.
                        </Text>
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
FreeTrialEmail.PreviewProps = {
    userFirstName: "Katja",
    freeTrialEndDate: "December 31, 2024",
} as FreeTrialEmailTemplateProps;

export default FreeTrialEmail;
