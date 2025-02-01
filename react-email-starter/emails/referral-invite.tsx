import { ReferralInviteEmail as ReferralInviteEmailProps } from "@/interfaces/services/resend";
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

export const ReferralInviteEmail = (props: ReferralInviteEmailProps) => (
    <Html>
        <Head />
        <Preview>You've Been Invited To 2mrw!</Preview>
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
                        You're Invited to 2mrw!
                    </Heading>

                    <Text className="mb-4 text-[15px] leading-relaxed text-gray-700">
                        {props.nameOfReferrer} wants YOU to join 2mrw and has shared a special
                        invite. You can create an account using the link below to get started.
                    </Text>

                    <Section className="my-4">
                        <Link
                            href={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/sign-up?method=magic-link:ref=${props.referralCode}`}
                            className="inline-block w-full rounded-md bg-blue-600 py-3 text-center text-sm font-medium text-white"
                        >
                            Sign Up To 2mrw
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

ReferralInviteEmail.PreviewProps = {
    nameOfReferrer: "Timo Huennebeck",
    referralCode: "RE8FAF912",
} as ReferralInviteEmailProps;

export default ReferralInviteEmail;
