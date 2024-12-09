"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileSection } from "./ProfileSection";
import { useUser } from "@/context/UserContext";
import { createClient } from "@/services/integration/client";
import { v4 as uuidv4 } from "uuid";

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

    return { publicUrl };
};

export const ProfilePictureSection = () => {
    const { dbUser } = useUser();

    const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size should be less than 2MB");
            return;
        }

        const result = await _updateProfilePicture(dbUser?.user_id ?? "", file);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Profile picture updated successfully!");
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
                    <AvatarFallback>{dbUser?.profile_image_url?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                    id="profile-picture-input"
                />

                <Button variant="outline" size="sm" onClick={() => {}}>
                    Delete Profile Picture
                </Button>

                <Button
                    type="button"
                    onClick={() => document.getElementById("profile-picture-input")?.click()}
                    className="w-fit"
                    size="sm"
                >
                    Upload Profile Picture
                </Button>
            </div>
        </ProfileSection>
    );
};
