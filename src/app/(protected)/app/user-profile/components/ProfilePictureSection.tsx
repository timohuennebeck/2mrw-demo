"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileSection } from "./ProfileSection";
import { useUser } from "@/context/UserContext";
import { createClient } from "@/services/integration/client";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { invalidateUserCache } from "@/services/redis/redisService";

const _updateProfilePicture = async (userId: string, file: File) => {
    const supabase = createClient();

    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from("profile_images")
        .upload(fileName, file);

    if (uploadError) return { error: "Error uploading image" };

    const {
        data: { publicUrl },
    } = supabase.storage.from("profile_images").getPublicUrl(fileName);

    const { error: updateError } = await supabase
        .from("users")
        .update({ profile_image_url: publicUrl })
        .eq("id", userId);

    if (updateError) return { error: "Error updating profile picture" };

    const { error: cacheError } = await invalidateUserCache(userId);
    if (cacheError) return { error: "Error invalidating user cache" };

    return { publicUrl };
};

const _deleteProfilePicture = async (userId: string, imageUrl: string | null) => {
    if (!imageUrl) return { error: "No profile picture to delete" };

    const supabase = createClient();

    const fileName = imageUrl.split("/").pop();
    if (!fileName) return { error: "Invalid image URL" };

    const { error: deleteError } = await supabase.storage
        .from("profile_images")
        .remove([`${userId}/${fileName}`]);

    if (deleteError) return { error: "Error deleting image" };

    const { error: updateError } = await supabase
        .from("users")
        .update({ profile_image_url: null })
        .eq("id", userId);

    if (updateError) return { error: "Error updating profile" };

    const { error: cacheError } = await invalidateUserCache(userId);
    if (cacheError) return { error: "Error invalidating user cache" };

    return { success: true };
};

export const ProfilePictureSection = () => {
    const { dbUser, invalidateUser } = useUser();

    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size should be less than 2MB");
            return;
        }

        setIsUploading(true);

        try {
            const result = await _updateProfilePicture(dbUser?.id ?? "", file);

            if (result.error) {
                toast.error(result.error);
            } else {
                invalidateUser();
                toast.success("Profile picture has been updated!");
            }
        } catch (error) {
            toast.error("Error updating profile picture");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeletePicture = async () => {
        setIsDeleting(true);

        try {
            const result = await _deleteProfilePicture(
                dbUser?.id ?? "",
                dbUser?.profile_image_url ?? null,
            );

            if (result.error) {
                toast.error(result.error);
            } else {
                invalidateUser();
                toast.success("Profile picture has been deleted!");
            }
        } catch (error) {
            toast.error("Error deleting profile picture");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <ProfileSection
            title="Profile Picture"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        >
            <div className="flex flex-row items-center gap-4">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={dbUser?.profile_image_url} />
                    <AvatarFallback>{dbUser?.first_name?.[0]?.toUpperCase() ?? "H"}</AvatarFallback>
                </Avatar>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                    id="profile-picture-input"
                />

                <Button
                    variant="outline"
                    size="sm"
                    disabled={!dbUser?.profile_image_url}
                    isLoading={isDeleting}
                    onClick={handleDeletePicture}
                >
                    Delete Profile Picture
                </Button>

                <Button
                    type="button"
                    onClick={() => document.getElementById("profile-picture-input")?.click()}
                    className="w-fit"
                    size="sm"
                    disabled={isUploading}
                    isLoading={isUploading}
                >
                    Upload Profile Picture
                </Button>
            </div>
        </ProfileSection>
    );
};
