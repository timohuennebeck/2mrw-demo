export const runtime = "nodejs";

import { appConfig } from "@/config";
import { FreeTrialStartedEmail as FreeTrialStartedEmailProps } from "@/interfaces/services/resend";
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";

export const FreeTrialStartedEmail = (props: FreeTrialStartedEmailProps) => (
    <Html>
        <Head />
        <Preview>Your {appConfig.company.name} Free Trial Has Started!</Preview>
        <Tailwind>
            <Body className="bg-white font-sans">
                <Container className="mx-auto max-w-[560px] px-4 py-12">
                    <Img
                        src="https://i.imgur.com/rlrv36H.png"
                        alt={appConfig.company.name}
                        width={42}
                        height={42}
                        className="block rounded-full"
                    />

                    <Heading className="my-5 text-2xl font-normal text-gray-700">
                        Your Free Trial Has Begun!
                    </Heading>

                    <Text className="mb-4 text-[15px] leading-relaxed text-gray-700">
                        Congratulations! Your <strong>{props.trialDuration}-DAY</strong> free trial
                        of {appConfig.company.name} has started and will be active until the{" "}
                        <strong>{props.trialEndDate}</strong>. Have fun!
                    </Text>

                    <Section className="my-4">
                        <Link
                            href={`${process.env.NEXT_PUBLIC_SITE_URL}/app`}
                            className="inline-block w-full rounded-md bg-blue-600 py-3 text-center text-sm font-medium text-white"
                        >
                            Start Exploring {appConfig.company.name}
                        </Link>
                    </Section>

                    <Text className="mb-4 text-[15px] leading-relaxed text-gray-700">
                        Have questions? Contact us at{" "}
                        <Link
                            href={`mailto:${appConfig.company.contactEmail}`}
                            className="text-blue-600 no-underline"
                        >
                            {appConfig.company.contactEmail}
                        </Link>
                    </Text>

                    <Text className="mt-2 text-xs text-gray-400">
                        © 2024 {appConfig.company.name}
                    </Text>
                </Container>
            </Body>
        </Tailwind>
    </Html>
);

FreeTrialStartedEmail.PreviewProps = {
    trialDuration: 14,
    trialEndDate: "25th of December, 2025",
} as FreeTrialStartedEmailProps;

export default FreeTrialStartedEmail;
