"use server";

import { ReferralStatus } from "@/enums/referral.enum";
import moment from "moment";
import { nanoid } from "nanoid";
import { createClient } from "../supabase-clients/server";

interface ProcessReferralSignupParams {
    newUserId: string;
    newUserEmail: string;
    referralCode?: string;
}

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

export const getExistingReferral = async (email: string) => {
    const supabase = await createClient();

    const { data: existingReferral, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referred_email", email)
        .in("status", [ReferralStatus.PENDING, ReferralStatus.COMPLETED])
        .order("created_at", { ascending: false })
        .limit(1)
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

export const processReferralSignup = async ({
    newUserId,
    newUserEmail,
    referralCode,
}: ProcessReferralSignupParams) => {
    const { data: existingReferral } = await getExistingReferral(newUserEmail); // check for pending referral (email, password, magic link flow, etc.)

    if (existingReferral) {
        return await updateReferralToCompleted(existingReferral.id, newUserId);
    }

    if (referralCode) {
        const supabase = await createClient(); // if no pending referral but we have a referral code (Google auth flow)

        const { referrer } = await getReferrerByReferralCode(referralCode);

        if (!referrer) {
            return { success: false, error: "The referral code is invalid" };
        }

        const { error: insertError } = await supabase
            .from("referrals")
            .insert({
                referrer_user_id: referrer.id,
                referred_email: newUserEmail,
                referred_user_id: newUserId,
                status: ReferralStatus.COMPLETED,
            });

        return { success: !insertError, insertError };
    }

    /**
     * FYI: This is the part where you can add new logic to the referral flow such as adding credits to the referrer and the referred users accounts, etc.
     */

    return { success: true };
};

export const referralCodeExists = async (referralCode: string) => {
    const supabase = await createClient();

    const { data: referrer } = await supabase
        .from("users")
        .select("id")
        .eq("referral_code", referralCode)
        .single();

    return { codeExists: !!referrer };
};

export const createPendingReferral = async (
    referredEmail: string,
    referrerUserId: string,
) => {
    const supabase = await createClient();

    const { error: insertError } = await supabase
        .from("referrals")
        .insert({
            referrer_user_id: referrerUserId,
            referred_email: referredEmail,
            status: ReferralStatus.PENDING,
        });

    return { success: !insertError, error: insertError };
};

export const getReferrerByReferralCode = async (referralCode: string) => {
    const supabase = await createClient();

    const { data: referrer, error } = await supabase
        .from("users")
        .select("id")
        .eq("referral_code", referralCode)
        .single();

    if (error) return { referrer: null, error };

    return { referrer, error: null };
};

export const fetchReferrals = async (userId: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_user_id", userId)
        .order("created_at", { ascending: false });

    return { referrals: data, error };
};

export const fetchCompletedReferrals = async (userId: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_user_id", userId)
        .eq("status", ReferralStatus.COMPLETED)
        .order("created_at", { ascending: false });

    return { referrals: data, error };
};
