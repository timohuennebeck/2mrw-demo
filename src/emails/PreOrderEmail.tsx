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
} from "@react-email/components";

interface ForjPreorderEmailProps {
    customerFullName: string;
    purchasedPackage: string;
    estimatedLaunchDate: string;
    companyTitle: string;
    customerSupportEmail: string;
}

const logoUrl = process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL
    ? `https://${process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL}`
    : "https://i.imgur.com/e0cWC6I.png";

export const ForjPreorderEmail = ({
    customerFullName,
    purchasedPackage,
    estimatedLaunchDate,
    companyTitle,
    customerSupportEmail,
}: ForjPreorderEmailProps) => {
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
                            Thaaaaank You! 😃
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hi {customerFullName},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            This is Timo, the founder of Forj. Thank You so much for pre-ordering
                            our <strong>{purchasedPackage}</strong>. You're awesome!
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            I know you're eager to get started, so here's what you can look forward
                            to:
                        </Text>
                        <Section className="ml-4">
                            <Text className="text-black text-[14px] leading-[24px]">
                                1. Every Thursday, you'll get exclusive insider updates from me,
                                sharing our latest developments, challenges, and victories.
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                2. We're aiming to launch the <strong>{purchasedPackage}</strong> on{" "}
                                <strong>{estimatedLaunchDate}</strong>.
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                3. You'll get priority access when we launch, with a personal email
                                from me on how to claim your account.
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                4. As an early supporter, you'll have a direct line to me for
                                feedback and suggestions. Feel free to reach out to me at{" "}
                                <strong>{customerSupportEmail}</strong>
                            </Text>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Thanks again for being one of our first adopters. We're pouring our
                            hearts into making {companyTitle} exceptional 🤩
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

// ForjPreorderEmail.PreviewProps = {
//     customerFullName: "Michael",
//     purchasedPackage: "Standard Package",
// } as ForjPreorderEmailProps;

export default ForjPreorderEmail;
