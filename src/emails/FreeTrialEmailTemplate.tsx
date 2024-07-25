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

interface FreeTrialEmailTemplateProps {
    userFirstName: string;
    companyTitle: string;
    trialDuration: number;
    trialSignupLink: string;
    twitterFounderUrl: string;
    twitterFounderTag: string;
}

export const FreeTrialEmailTemplate = ({
    userFirstName,
    companyTitle,
    trialDuration,
    trialSignupLink,
    twitterFounderUrl,
    twitterFounderTag,
}: FreeTrialEmailTemplateProps) => {
    const previewText = `Here's a little gift inside`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-gray-200 rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Img
                            src={process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL}
                            width="48"
                            height="48"
                            alt={companyTitle}
                            className="my-0 mx-auto"
                        />
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Welcome to {companyTitle}!
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hi {userFirstName},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            I'm thrilled you've decided to check out {companyTitle}! It's always
                            exciting to welcome someone new to our gang! 🤩
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            P.S. Here's a special welcome gift: a{" "}
                            <strong>Full-Access {trialDuration}-Day Free Trial </strong> of{" "}
                            {companyTitle}. You don't even need to enter a credit card. It's
                            risk-free and commitment-free.
                        </Text>
                        <Button
                            className="bg-black rounded text-white text-[14px] font-semibold no-underline text-center w-full py-2.5"
                            href={trialSignupLink}
                        >
                            Start Free Trial Now
                        </Button>
                        <Text className="text-[12px] leading-[18px] mt-4 mb-0 text-center italic">
                            You can also copy and paste this link into your browser:{" "}
                            {trialSignupLink}
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            If you have any questions or need clarification about our services,
                            please don't hesitate to reach out to me.
                        </Text>
                        <Text className="text-[14px] leading-[24px]">
                            You can find me on Twitter at{" "}
                            <Link href={twitterFounderUrl} className="text-blue-500">
                                {twitterFounderTag}
                            </Link>
                            , where I regularly share updates about {companyTitle} and engage with
                            our users.
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
FreeTrialEmailTemplate.PreviewProps = {
    userFirstName: "Sarah",
    companyTitle: "Forj",
    trialDuration: 14,
    trialSignupLink: "https://app.joinforj.com/trial",
    twitterFounderUrl: "https://twitter.com/timohuennebeck",
    twitterFounderTag: "@timohuennebeck",
} as FreeTrialEmailTemplateProps;

export default FreeTrialEmailTemplate;
