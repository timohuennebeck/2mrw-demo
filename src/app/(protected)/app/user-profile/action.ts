"use server";

import { createClient } from "@/services/supabase-clients/server";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

interface UpdateUserProfileImageProps {
    profileImageUrl: string;
    userId: string;
    formData: FormData;
}

export const updateUserProfileImage = async ({
    profileImageUrl,
    userId,
    formData,
}: UpdateUserProfileImageProps) => {
    const supabase = await createClient();

    try {
        const file = formData.get("file") as File;

        // create unique file path
        const fileExt = file.name.split(".").pop();
        const hasProfileImage = profileImageUrl !== "";

        if (profileImageUrl && hasProfileImage) {
            const oldStoragePath = profileImageUrl.split("profile_images/")[1];

            const { error: deleteError } = await supabase.storage
                .from("profile_images")
                .remove([oldStoragePath]);

            if (deleteError) throw deleteError;
        }

        const storagePath = `${userId}/${uuidv4()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from("profile_images")
            .upload(storagePath, file, {
                upsert: true,
            });

        if (uploadError) throw uploadError;

        // get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from("profile_images").getPublicUrl(storagePath);

        // update user profile in database
        const { error: updateError } = await supabase
            .from("users")
            .update({
                profile_image_url: publicUrl,
                updated_at: moment().toISOString(),
            })
            .eq("id", userId);

        if (updateError) throw updateError;

        return { success: true, publicUrl };
    } catch (error) {
        return { success: false, error: "Error uploading profile image" };
    }
};

export async function updateUserPassword(password: string) {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        return { error: "Error updating password" };
    }

    return { success: true };
}
