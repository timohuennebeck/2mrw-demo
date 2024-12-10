"use client";

import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { ProfilePictureSection } from "./components/ProfilePictureSection";
import { PersonalInfoSection } from "./components/PersonalInfoSection";
import { PasswordSection } from "./components/PasswordSection";
import { DeleteProfileSection } from "./components/DeleteProfileSection";
import { SearchParamsHandler } from "./components/SearchParamsHandler";
import { useUser } from "@/context/UserContext";
import { SignUpMethod } from "@/enums/user";

const UserProfilePage = () => {
    const { dbUser } = useUser();

    return (
        <div className="flex max-w-6xl flex-col gap-12 bg-white">
            <Suspense fallback={null}>
                <SearchParamsHandler />
            </Suspense>

            <ProfilePictureSection />
            <Separator />

            <PersonalInfoSection />
            <Separator />

            {dbUser?.auth_method === SignUpMethod.PASSWORD && (
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
