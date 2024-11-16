import { sendEmail } from "@/services/email/emailService";
import { validateEmailProps } from "@/utils/validators/emailValidator";
import { NextResponse as response, NextRequest as request } from "next/server";

export const POST = async (req: request) => {
    try {
        const { template, ...emailProps } = await req.json();

        const { error: validationError } = validateEmailProps(template, emailProps);

        if (validationError) {
            return response.json({ error: validationError }, { status: 400 });
        }

        const { data, error } = await sendEmail(template, emailProps);

        if (error) {
            return response.json({ error }, { status: 500 });
        }

        return response.json({ message: "Email has been sent", data }, { status: 200 });
    } catch (error) {
        console.error("Error in email service:", error);
        return response.json({ error: "Failed to send email" }, { status: 500 });
    }
};
