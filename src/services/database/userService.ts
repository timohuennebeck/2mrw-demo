"use server";

import { TextConstants } from "@/constants/TextConstants";
import { AuthMethod } from "@/enums/user";
import { User } from "@/interfaces";
import { handleError } from "@/utils/errors/error";
import { User as SupabaseUser } from "@supabase/supabase-js";
import moment from "moment";
import { createClient } from "../integration/server";

export const checkUserEmailExists = async (userEmail: string) => {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from("users")
            .select("email")
            .eq("email", userEmail)
            .single();

        if (error?.code === "PGRST116") {
            // no matching email found (single row not found) - this is good for registration
            return { emailExists: false, error: null };
        }

        if (error) return { emailExists: false, error };

        return { emailExists: true, error: null };
    } catch (error) {
        return {
            emailExists: false,
            error: handleError(error, "checkUserEmailExists"),
        };
    }
};

export const fetchUser = async (userId: string) => {
    try {
        const supabase = await createClient();

        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) return { data: null, error };

        return { data: user as User, error: null };
    } catch (error) {
        return {
            data: null,
            error: handleError(error, "fetchUser"),
        };
    }
};

export const createUserTable = async (
    authUser: SupabaseUser,
    authMethod: AuthMethod,
) => {
    try {
        const supabase = await createClient();

        const { error } = await supabase.from("users").insert({
            id: authUser.id,
            email: authUser.email,
            updated_at: moment().toISOString(),
            created_at: moment().toISOString(),
            auth_method: authMethod,
            onboarding_completed: false,
        });

        if (error) return { success: false, error };

        return { success: true, error: null };
    } catch (error) {
        return {
            success: false,
            error: handleError(error, "createUserTable"),
        };
    }
};
