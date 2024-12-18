"use server";

import { TextConstants } from "@/constants/TextConstants";
import { AuthMethod } from "@/enums/user";
import { User } from "@/interfaces";
import { handleSupabaseError } from "@/utils/errors/supabaseError";
import { User as SupabaseUser } from "@supabase/supabase-js";
import moment from "moment";
import { createClient } from "../integration/server";
import { setCachedUser } from "../redis/redisService";

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
            return { data: null, error: null };
        }

        if (error) throw error;

        return { data: TextConstants.ERROR__EMAIL_ALREADY_IN_USE, error: null };
    } catch (error) {
        return {
            data: null,
            error: handleSupabaseError(error, "checkUserEmailExists"),
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

        if (error) throw error;

        return { user: user as User, error: null };
    } catch (error) {
        return {
            user: null,
            error: handleSupabaseError(error, "fetchUser"),
        };
    }
};

export const createUserTable = async (authUser: SupabaseUser, authMethod: AuthMethod) => {
    try {
        const supabase = await createClient();

        const { error } = await supabase.from("users").insert({
            id: authUser.id,
            first_name: authUser.user_metadata.full_name,
            email: authUser.email,
            updated_at: moment().toISOString(),
            created_at: moment().toISOString(),
            auth_method: authMethod,
            onboarding_completed: false,
        });

        if (error) throw error;

        const { error: cacheError } = await setCachedUser(authUser.id, authUser);
        if (cacheError) console.error("Failed to set user cache:", cacheError);

        return { data: TextConstants.TEXT__SUCCESS_USER_CREATED, error: null };
    } catch (error) {
        return {
            data: null,
            error: handleSupabaseError(error, "createUserTable"),
        };
    }
};
