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
    Text,
    Tailwind,
    Link,
    Button,
} from "@react-email/components";
import { emailConfig } from "@/config/emailConfig";

interface FreeTrialEmailTemplateProps {
    userFirstName: string;
    trialSignupLink: string;
}

export const FreeTrialEmailTemplate = ({
    userFirstName,
    trialSignupLink,
}: FreeTrialEmailTemplateProps) => {
    const { companyInformation, socialLinks, settings } = emailConfig;

    const previewText = `Here's a little gift inside`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="mx-auto my-auto bg-white px-2 font-sans">
                    <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-neutral-200 p-[20px]">
                        <Img
                            src={process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL}
                            width="48"
                            height="48"
                            alt={companyInformation.name}
                            className="mx-auto my-0"
                        />
                        <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
                            Welcome to {companyInformation.name}!
                        </Heading>
                        <Text className="text-[14px] leading-[24px] text-black">
                            Hi {userFirstName},
                        </Text>
                        <Text className="text-[14px] leading-[24px] text-black">
                            I'm thrilled you've decided to check out {companyInformation.name}! It's
                            always exciting to welcome someone new to our gang! 🤩
                        </Text>
                        <Text className="text-[14px] leading-[24px] text-black">
                            P.S. Here's a special welcome gift: a{" "}
                            <strong>
                                Full-Access {settings.freeTrialEmail.freeTrialDuration}-Day Free
                                Trial{" "}
                            </strong>{" "}
                            of {companyInformation.name}. You don't even need to enter a credit
                            card. It's risk-free and commitment-free.
                        </Text>
                        <Button
                            className="w-full rounded bg-black py-2.5 text-center text-[14px] font-semibold text-white no-underline"
                            href={trialSignupLink}
                        >
                            Start Free Trial Now
                        </Button>
                        <Text className="mb-0 mt-4 text-center text-[12px] italic leading-[18px]">
                            You can also copy and paste this link into your browser:{" "}
                            {trialSignupLink}
                        </Text>
                        <Text className="text-[14px] leading-[24px] text-black">
                            If you have any questions or need clarification about our services,
                            please don't hesitate to reach out to me.
                        </Text>
                        <Text className="text-[14px] leading-[24px]">
                            You can find me on Twitter at{" "}
                            <Link href={socialLinks.twitter.founder.url} className="text-blue-500">
                                {socialLinks.twitter.founder.tag}
                            </Link>
                            , where I regularly share updates about {companyInformation.name} and
                            engage with our users.
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
FreeTrialEmailTemplate.PreviewProps = {
    userFirstName: "Sarah",
    trialSignupLink: `${process.env.NEXT_PUBLIC_SITE_URL}/choose-pricing-plan?welcomeEmail=true`,
} as FreeTrialEmailTemplateProps;

export default FreeTrialEmailTemplate;
