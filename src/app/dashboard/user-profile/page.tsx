"use client";

import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { ProfilePictureSection } from "./components/ProfilePictureSection";
import { PersonalInfoSection } from "./components/PersonalInfoSection";
import { PasswordSection } from "./components/PasswordSection";
import { DeleteProfileSection } from "./components/DeleteProfileSection";
import { SearchParamsHandler } from "./components/SearchParamsHandler";

const UserProfilePage = () => {
    return (
        <div className="flex max-w-6xl flex-col gap-12 bg-white">
            <Suspense fallback={null}>
                <SearchParamsHandler />
            </Suspense>

            <ProfilePictureSection />
            <Separator />

            <PersonalInfoSection />
            <Separator />

            <PasswordSection />
            <Separator />

            <DeleteProfileSection />
        </div>
    );
};

export default UserProfilePage;
