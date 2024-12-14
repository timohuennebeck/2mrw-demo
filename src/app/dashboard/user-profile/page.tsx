"use client";

import { Separator } from "@/components/ui/separator";
import { ProfilePictureSection } from "./components/ProfilePictureSection";
import { PersonalInfoSection } from "./components/PersonalInfoSection";
import { PasswordSection } from "./components/PasswordSection";
import { DeleteProfileSection } from "./components/DeleteProfileSection";
import { useUser } from "@/context/UserContext";
import { AuthMethod } from "@/enums/user";

const UserProfilePage = () => {
    const { dbUser } = useUser();

    return (
        <div className="flex max-w-6xl flex-col gap-12 bg-white">
            <ProfilePictureSection />
            <Separator />

            <PersonalInfoSection />
            <Separator />

            {dbUser?.auth_method === AuthMethod.PASSWORD && (
                <>
                    <PasswordSection />
                    <Separator />
                </>
            )}

            <DeleteProfileSection />
        </div>
    );
};

export default UserProfilePage;
