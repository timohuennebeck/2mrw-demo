"use server";

import { createSubscriptionTable, createUserTable } from "@/utils/supabase/admin";
import { checkUserExists } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";

export async function signUp(formData: FormData) {
    const supabase = createClient();

    const firstName = formData.get("firstName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // if the user creation succeeds but the subscription table creation fails,
    // all changes made within the transaction will be rolled back, so that we can maintain data consistency
    const { data: transaction, error: transactionError } = await supabase.rpc("start_transaction");

    if (transactionError) {
        console.error("Failed to start transaction:", transactionError);

        return { error: "There has been an error during sign up." };
    }

    try {
        const existingUser = await checkUserExists({ userEmail: email });

        if (existingUser) {
            await supabase.rpc("rollback_transaction", { transaction_id: transaction.id });

            return { error: "This email is already in use. Please log in to continue." };
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                },
            },
        });

        if (error) {
            await supabase.rpc("rollback_transaction", { transaction_id: transaction.id });
            return { error: error.message };
        }

        const { user } = data;

        if (!user) {
            await supabase.rpc("rollback_transaction", { transaction_id: transaction.id });

            return { error: "User creation failed." };
        }

        await createUserTable({ user });

        await createSubscriptionTable({ userId: user.id });

        await supabase.rpc("commit_transaction", { transaction_id: transaction.id });

        return { success: true };
    } catch (err) {
        await supabase.rpc("rollback_transaction", { transaction_id: transaction.id });

        console.error("Unexpected error during sign up:", err);

        return { error: "There has been an error during sign up." };
    }
}
