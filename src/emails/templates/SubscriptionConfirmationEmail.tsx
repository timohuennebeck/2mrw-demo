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

interface SubscriptionConfirmationEmailProps {
    userFirstName: string;
    purchasedPackage: string;
}

const SubscriptionConfirmationEmail = ({
    userFirstName,
    purchasedPackage,
}: SubscriptionConfirmationEmailProps) => {
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
                            I'm thrilled to welcome You as a member of{" "}
                            <strong>{companyInformation.name}</strong> fam! Your trust in me means
                            the absolute world to me, and I can't wait to see what You will create!
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
SubscriptionConfirmationEmail.PreviewProps = {
    userFirstName: "Katja",
    purchasedPackage: "Premium Plan (20% off)",
} as SubscriptionConfirmationEmailProps;

export default SubscriptionConfirmationEmail;
