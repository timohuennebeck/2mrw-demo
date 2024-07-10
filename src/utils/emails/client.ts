import PreOrderEmail from "@/emails/PreOrderEmail";
import { PreOrderEmailInterface } from "@/interfaces/PreOrderEmailInterface";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_EMAIL_API_KEY ?? "");

export const sendPreOrderEmail = async ({
    customerEmail,
    customerFullName,
    purchasedPackage,
}: PreOrderEmailInterface) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: customerEmail,
            subject: `Order Confirmation - ${purchasedPackage}`,
            react: PreOrderEmail({
                customerFullName,
                purchasedPackage,
                estimatedLaunchDate: "September 15, 2024",
                companyTitle: "Forj",
                customerSupportEmail: "hello@joinforj.com",
            }),
        });

        if (error) {
            console.error("Failed to send email:", error);
            throw new Error("Email sending failed");
        }

        return data;
    } catch (error) {
        console.error("Unexpected error while sending email:", error);
        throw error;
    }
};
