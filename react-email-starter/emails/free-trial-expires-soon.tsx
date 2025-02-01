import { FreeTrialExpiresEmail as FreeTrialExpiresEmailProps } from "@/interfaces/services/resend";
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
import * as React from "react";

export const FreeTrialExpiresEmail = (props: FreeTrialExpiresEmailProps) => (
    <Html>
        <Head />
        <Preview>Your Free Trial is Ending Soon!</Preview>
        <Tailwind>
            <Body className="bg-white font-sans">
                <Container className="mx-auto max-w-[560px] px-4 py-12">
                    <Img
                        src="https://i.imgur.com/rlrv36H.png"
                        alt="2mrw"
                        width={42}
                        height={42}
                        className="block rounded-full"
                    />

                    <Heading className="my-5 text-2xl font-normal text-gray-700">
                        Free Trial Ending Soon!
                    </Heading>

                    <Text className="mb-4 text-[15px] leading-relaxed text-gray-700">
                        Your <strong>{props.trialDuration}-DAY</strong> free trial is about to
                        expire within the next <strong>72 hours.</strong> To continue using 2mrw,
                        please upgrade to a paid plan.
                    </Text>

                    <Text className="mb-4 text-[15px] leading-relaxed text-gray-700">
                        Use the discount code <strong>{props.discountCode}</strong> to get 40% off
                        when upgrading to a paid plan.
                    </Text>

                    <Section className="my-4">
                        <Link
                            href={`${props.siteUrl}/choose-pricing-plan`}
                            className="inline-block w-full rounded-md bg-blue-600 py-3 text-center text-sm font-medium text-white"
                        >
                            Use 40% Discount Code
                        </Link>
                    </Section>

                    <Text className="mb-4 text-[15px] leading-relaxed text-gray-700">
                        Have questions? Contact us at{" "}
                        <Link href="mailto:support@2mrw.dev" className="text-blue-600 no-underline">
                            support@2mrw.dev
                        </Link>
                    </Text>

                    <Text className="mt-2 text-xs text-gray-400">© 2024 2mrw</Text>
                </Container>
            </Body>
        </Tailwind>
    </Html>
);

FreeTrialExpiresEmail.PreviewProps = {
    siteUrl: "https://2mrw.dev",
    trialDuration: 3,
    discountCode: "84BFL12",
} as FreeTrialExpiresEmailProps;

export default FreeTrialExpiresEmail;
