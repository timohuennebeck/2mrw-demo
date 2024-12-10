"use client";

import { ProfileSection } from "./ProfileSection";
import Link from "next/link";

export const PasswordSection = () => {
    return (
        <ProfileSection
            title="Password"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        >
            <div className="rounded-lg border p-6">
                <p className="text-sm text-muted-foreground">
                    To reset the password, follow{" "}
                    <Link href="/auth/forgot-password" className="text-primary hover:underline">
                        this link
                    </Link>{" "}
                    and we will send instructions to make reset it.
                </p>
            </div>
        </ProfileSection>
    );
};
