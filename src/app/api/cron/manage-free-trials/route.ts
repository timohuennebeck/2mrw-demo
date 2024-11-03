import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { endUserFreeTrial, getSupabasePowerUser } from "@/services/supabase/admin";
import moment from "moment";
import { NextResponse as response } from "next/server";
import { EmailTemplate, sendEmail } from "@/lib/email/emailService";
import { validateEmailProps } from "@/lib/validation/emailValidation";

export const dynamic = "force-dynamic";

export const GET = async () => {
    const supabasePowerUser = await getSupabasePowerUser();

    try {
        const { data: activeTrials, error: fetchError } = await supabasePowerUser
            .from("free_trials")
            .select("user_id, status, end_date")
            .in("status", [FreeTrialStatus.ACTIVE, FreeTrialStatus.CANCELLED]);

        if (fetchError) throw fetchError;

        const now = moment();
        const twoDaysFromNow = moment().add(2, "days").startOf("day");

        const updatePromise = activeTrials.map(async (trial) => {
            const endDate = moment(trial.end_date).startOf("day");

            // check if trial has ended (now is past the start of end_date)
            if (endDate.isBefore(now)) {
                const { error } = await endUserFreeTrial({ userId: trial.user_id });
                if (error) throw error;

                await supabasePowerUser.auth.admin.updateUserById(trial.user_id, {
                    user_metadata: {
                        free_trial_status: FreeTrialStatus.EXPIRED,
                    },
                });
                return;
            }

            // check if trial ends in 2 days
            if (endDate.isSame(twoDaysFromNow, "day")) {
                const { data: userData, error: userError } = await supabasePowerUser
                    .from("users")
                    .select("first_name, email")
                    .eq("id", trial.user_id)
                    .single();

                if (userError) {
                    console.error("Failed to fetch user data for email:", userError);
                    return;
                }

                try {
                    const { error: validationError } = validateEmailProps(
                        EmailTemplate.FREE_TRIAL_REMINDER,
                        {
                            userEmail: userData.email,
                            userFirstName: userData.first_name,
                            freeTrialEndDate: endDate.format("MMMM D, YYYY"),
                            upgradeUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/choose-pricing-plan`,
                        },
                    );

                    if (validationError) {
                        console.error("Invalid email props:", validationError);
                        return;
                    }

                    await sendEmail(EmailTemplate.FREE_TRIAL_REMINDER, {
                        userEmail: userData.email,
                        userFirstName: userData.first_name,
                        freeTrialEndDate: endDate.format("MMMM D, YYYY"),
                        upgradeUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/choose-pricing-plan`,
                    });
                } catch (emailError) {
                    console.error("Failed to send trial reminder email:", emailError);
                }
            }
        });

        if (updatePromise.length) {
            await Promise.all(updatePromise);
        }

        return response.json({ success: true });
    } catch (error) {
        return response.json({ success: false, error: error });
    }
};
