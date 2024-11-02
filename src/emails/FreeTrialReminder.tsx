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

interface FreeTrialReminderEmailTemplateProps {
    userFirstName: string;
    freeTrialEndDate: string;
    upgradeUrl: string;
}

const FreeTrialReminderEmail = ({
    userFirstName,
    freeTrialEndDate,
    upgradeUrl,
}: FreeTrialReminderEmailTemplateProps) => {
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
                            Your free trial is ending soon!
                        </Heading>
                        <Text className="text-[14px] leading-[24px] text-black">
                            Hi {userFirstName},
                        </Text>
                        <Text className="text-[14px] leading-[24px] text-black">
                            It's me again, just a friendlY reminder that Your free trial will end on{" "}
                            <strong>{freeTrialEndDate}</strong>.
                        </Text>
                        <Text className="text-[14px] leading-[24px] text-black">
                            To continue using all the features without interruption, You can upgrade
                            to a full subscription now.
                        </Text>

                        <Button
                            className="my-6 w-full rounded bg-black py-2.5 text-center text-[14px] font-semibold text-white no-underline"
                            href={upgradeUrl}
                        >
                            UPGRADE NOW →
                        </Button>

                        <Text className="mt-4 text-[14px] leading-[24px] text-black">
                            If You have any questions or need assistance, feel free to reach out to
                            me on Twitter at{" "}
                            <Link href={socialLinks.twitter.founder.url} className="text-blue-500">
                                {socialLinks.twitter.founder.tag}
                            </Link>
                            .
                        </Text>

                        <Hr className="mx-0 my-[26px] w-full border border-solid border-neutral-200" />

                        <Text className="text-[12px] leading-[24px] text-neutral-500">
                            Best regards,
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
FreeTrialReminderEmail.PreviewProps = {
    userFirstName: "Katja",
    freeTrialEndDate: "December 31, 2024",
    upgradeUrl: "https://app.example.com/upgrade",
} as FreeTrialReminderEmailTemplateProps;

export default FreeTrialReminderEmail;
