"use server";

import { User } from "@/interfaces/UserInterfaces";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { getClients } from "./BaseService";
import moment from "moment";
import { handleSupabaseError } from "@/lib/helper/SupabaseHelper";

export const checkEmailExists = async (userEmail: string) => {
    try {
        const { supabase } = await getClients();

        const { error } = await supabase
            .from("users")
            .select("email")
            .eq("email", userEmail)
            .single();

        if (error) throw error;

        return { emailExists: true, error: null };
    } catch (error) {
        return {
            emailExists: false,
            error: handleSupabaseError({ error, fnTitle: "checkUserEmailExists" }),
        };
    }
};

export const fetchUser = async (userId: string) => {
    try {
        const { supabase } = await getClients();

        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) throw error;

        return { user: user as User, error: null };
    } catch (error) {
        return {
            user: null,
            error: handleSupabaseError({ error, fnTitle: "fetchUser" }),
        };
    }
};

export const getUserId = async () => {
    try {
        const { supabase } = await getClients();
        const { data, error } = await supabase.from("users").select("id").single();

        if (error) throw error;

        return data?.id;
    } catch (error) {
        return null;
    }
};

export const createUserTable = async (authUser: SupabaseUser) => {
    try {
        const { supabase } = await getClients();

        const { error } = await supabase.from("users").insert({
            id: authUser.id,
            first_name: authUser.user_metadata.full_name,
            email: authUser.email,
            updated_at: moment().toISOString(),
            created_at: moment().toISOString(),
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "createUserTable" }),
        };
    }
};

export const updateUserStripeCustomerId = async (userId: string, stripeCustomerId: string) => {
    try {
        const { supabase } = await getClients();

        const { error } = await supabase
            .from("users")
            .update({
                stripe_customer_id: stripeCustomerId,
                updated_at: moment().toISOString(),
            })
            .eq("id", userId);

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "updateUserStripeCustomerId" }),
        };
    }
};
