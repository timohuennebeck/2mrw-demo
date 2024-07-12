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

interface OrderConfirmationEmailTemplateProps {
    userFullName: string;
    purchasedPackage: string;
    companyTitle: string;
    userEmail: string;
    accountSetupLink: string;
    twitterCompanyUrl: string;
    twitterCompanyTag: string;
    twitterFounderUrl: string;
    twitterFounderTag: string;
}

const logoUrl = process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL
    ? `https://${process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL}`
    : "https://i.imgur.com/e0cWC6I.png";

export const OrderConfirmationEmailTemplate = ({
    userFullName,
    purchasedPackage,
    companyTitle,
    userEmail,
    accountSetupLink,
    twitterCompanyUrl,
    twitterCompanyTag,
    twitterFounderUrl,
    twitterFounderTag,
}: OrderConfirmationEmailTemplateProps) => {
    const previewText = `Thank you for your order of ${purchasedPackage}!`;

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
                                alt={companyTitle}
                                className="my-0 mx-auto"
                            />
                        </Section>
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            You're (almost) all set!
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hi {userFullName},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Welcome to the {companyTitle} familY! Your transaction for{" "}
                            <strong>{purchasedPackage}</strong> has been successfullY processed.
                        </Text>
                        <Section className="bg-gray-50 rounded-lg p-6 my-6">
                            <Text className="text-[16px] leading-[24px] m-0 font-semibold">
                                Let's Get You Set Up:
                            </Text>
                            <Text className="text-[14px] leading-[22px] mt-2 mb-4">
                                1. Create Your account (it onlY takes a couple of seconds!)
                                <br />
                                2. Your subscription will automaticallY link to Your new account
                                <br />
                                3. Dive in and start supercharging Your workflow!
                            </Text>
                            <Button
                                className="bg-black rounded text-white text-[14px] font-semibold no-underline text-center w-full py-2.5"
                                href={accountSetupLink}
                            >
                                Create Your Account Now
                            </Button>
                            <Text className="text-[12px] leading-[18px] mt-4 mb-0 text-center italic">
                                Important: Use the same email address ({userEmail}) You used for
                                Your Stripe paYment to ensure Your subscription links correctlY.
                            </Text>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            P.S.: This is sooo exciting! I'd love to hear about how You're using{" "}
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
OrderConfirmationEmailTemplate.PreviewProps = {
    userFullName: "Sarah",
    purchasedPackage: "Premium Plan (20% off)",
    companyTitle: "Forj",
    userEmail: "timo.huennebeck@outlook.de",
    accountSetupLink: "https://app.joinforj.com/setup",
    twitterCompanyUrl: "www.x.com/joinforj",
    twitterCompanyTag: "@joinforj",
    twitterFounderUrl: "www.x.com/timohuennebeck",
    twitterFounderTag: "@timohuennebeck",
} as OrderConfirmationEmailTemplateProps;

export default OrderConfirmationEmailTemplate;
