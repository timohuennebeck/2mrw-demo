"use server";

import { ReferralStatus } from "@/enums/referral";
import { createClient } from "../integration/server";
import { nanoid } from "nanoid";
import moment from "moment";

/**
 * referrer_id: The user ID of the person who sent the referral (the existing user)
 * referred_id: The user ID of the person who signed up using the referral link (the new user)
 */

export const createOrGetReferralCode = async (userId: string) => {
    const supabase = await createClient();

    const { data: user } = await supabase
        .from("users")
        .select("referral_code")
        .eq("id", userId)
        .single();

    if (user?.referral_code) return { code: user.referral_code };

    const newCode = nanoid(8).toUpperCase(); // if no referral code, create a new one and update it in the database

    const { error } = await supabase
        .from("users")
        .update({ referral_code: newCode })
        .eq("id", userId);

    if (error) return { error };
    return { code: newCode };
};

export const getReferralLink = async (userId: string) => {
    const { code } = await createOrGetReferralCode(userId);

    if (code) return `${process.env.NEXT_PUBLIC_SITE_URL}/referral/${code}`;
};

const getPendingReferral = async (email: string) => {
    const supabase = await createClient();

    const { data: existingReferral, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referred_email", email)
        .eq("status", ReferralStatus.PENDING)
        .single();

    if (error) return { data: null, error };

    return { data: existingReferral, error: null };
};

const updateReferralToCompleted = async (
    referralId: string,
    newUserId: string,
) => {
    const supabase = await createClient();

    const { error } = await supabase
        .from("referrals")
        .update({
            referred_user_id: newUserId,
            status: ReferralStatus.COMPLETED,
            updated_at: moment().toISOString(),
        })
        .eq("id", referralId);

    return { success: !error, error };
};

export const processReferralSignup = async (
    referralCode: string,
    newUserId: string,
    newUserEmail: string,
) => {
    const { data: pendingReferral } = await getPendingReferral(newUserEmail); // will return null if the user signed up via the referral link because a pending referral is only created when a user invites a user via email

    if (pendingReferral) {
        return await updateReferralToCompleted(pendingReferral.id, newUserId);
    }

    const supabase = await createClient(); // if no pending referral, create new one

    const { data: referrer } = await supabase
        .from("users")
        .select("id")
        .eq("referral_code", referralCode)
        .single();

    if (!referrer) {
        return { success: false, error: "The referral code is invalid" };
    }

    const { error } = await supabase
        .from("referrals")
        .insert({
            referrer_user_id: referrer.id,
            referred_email: newUserEmail,
            referred_user_id: newUserId,
            status: ReferralStatus.COMPLETED,
        });

    return { success: !error, error };
};

export const referralCodeExists = async (code: string) => {
    const supabase = await createClient();

    const { data: referrer } = await supabase
        .from("users")
        .select("id")
        .eq("referral_code", code)
        .single();

    return { codeExists: !!referrer };
};
