"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/services/supabase/client";
import DashboardLayout from "../DashboardLayout";
import { toast } from "sonner";
import moment from "moment";
import { useSession } from "@/context/SessionContext";
import useUser from "@/hooks/useUser";
import InputField from "@/components/InputField";
import HeaderWithDescription from "@/components/HeaderWithDescription";
import PasswordStrengthChecker from "@/components/PasswordStrengthChecker";
import CustomButton from "@/components/CustomButton";

const UserProfilePage = () => {
    const { authUser } = useSession();
    const { dbUser } = useUser(authUser?.id ?? "");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isUpdatingPersonalInfo, setIsUpdatingPersonalInfo] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [pendingEmail, setPendingEmail] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        if (dbUser) {
            setName(dbUser.first_name);
            setEmail(dbUser.email);
            setIsLoading(false);
        }
    }, [dbUser]);

    useEffect(() => {
        // Set up auth state change listener
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("→ [LOG] event", event);
            console.log("→ [LOG] session", session);

            if (event === "USER_UPDATED" && session?.user.email === pendingEmail) {
                // Email was verified, now update the database
                const { error: databaseError } = await supabase
                    .from("users")
                    .update({
                        first_name: name,
                        email: pendingEmail,
                        updated_at: moment().toISOString(),
                    })
                    .eq("id", authUser?.id);

                if (databaseError) {
                    toast.error("Error updating profile in database");
                } else {
                    toast.success("Profile successfully updated");
                    setPendingEmail(null);
                }
            }
        });

        // Cleanup subscription
        return () => {
            subscription.unsubscribe();
        };
    }, [pendingEmail, name, authUser?.id, supabase]);

    const hasPersonalInfoChanged = () => {
        if (isLoading || !dbUser) return false;
        return name !== dbUser.first_name || email !== dbUser.email;
    };

    const updateUserEmail = async () => {
        setPendingEmail(email);

        const { error: authError } = await supabase.auth.updateUser({
            email: email,
        });

        if (authError) {
            toast.error("Error updating email.");
            setPendingEmail(null);
        } else {
            toast.success("Please check email inbox to confirm the new email address.");
        }
    };

    const updateUserDatabase = async () => {
        const { error: databaseError } = await supabase
            .from("users")
            .update({ first_name: name, updated_at: moment().toISOString() })
            .eq("id", authUser?.id);

        if (databaseError) {
            toast.error("Error updating database.");
        } else {
            toast.success("Your profile has been updated.");
        }
    };

    const handlePersonalInfoSubmit = async () => {
        setIsUpdatingPersonalInfo(true);

        if (email !== dbUser?.email) {
            await updateUserEmail(); // if email changed, request email update
        }

        if (name !== dbUser?.first_name) {
            await updateUserDatabase(); // if name changed, update just the database
        }

        setIsUpdatingPersonalInfo(false);
    };

    const handleChangePasswordSubmit = async () => {
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsUpdatingPassword(true);

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            toast.error("Error updating password");
        } else {
            toast.success("Password updated");
            setPassword("");
            setConfirmPassword("");
        }

        setIsUpdatingPassword(false);
    };

    const handleDeleteAccount = () => {
        // Implement logic to delete account
        console.log("Delete account requested");
    };

    return (
        <DashboardLayout>
            <div className="container max-w-3xl bg-white">
                <HeaderWithDescription
                    title="Personal Profile"
                    isPageHeader
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, itaque!"
                />

                <div className="flex items-center">
                    <div className="mr-6 h-24 w-24 rounded-full bg-gray-200">
                        {/* Placeholder for profile image */}
                    </div>

                    <CustomButton title="Change avatar" />
                </div>

                <form onSubmit={handlePersonalInfoSubmit} className="mt-6">
                    <HeaderWithDescription
                        title="Personal Information"
                        description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, itaque!"
                    />
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <label
                                htmlFor="name"
                                className="w-1/3 text-sm font-medium text-gray-700"
                            >
                                Full name
                            </label>
                            <div className="w-2/3">
                                <InputField
                                    id="name"
                                    label="Full Name"
                                    hideLabel
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={(value) => setName(value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center">
                            <label
                                htmlFor="email"
                                className="w-1/3 text-sm font-medium text-gray-700"
                            >
                                Email address
                            </label>

                            <div className="w-2/3">
                                <InputField
                                    id="email"
                                    label="Email Address"
                                    hideLabel
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(value) => setEmail(value)}
                                />

                                {pendingEmail && (
                                    <div className="mt-2 flex items-center gap-2 text-sm">
                                        <span className="text-amber-600">
                                            Email verification pending for: {pendingEmail}
                                        </span>
                                        <button
                                            onClick={() => setPendingEmail(null)}
                                            className="rounded-md border border-gray-300 px-2 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <CustomButton
                            title={
                                isUpdatingPersonalInfo ? "Updating..." : "Save Personal Information"
                            }
                            onClick={handlePersonalInfoSubmit}
                            disabled={isUpdatingPersonalInfo || !hasPersonalInfoChanged()}
                        />
                    </div>
                </form>

                <form onSubmit={handleChangePasswordSubmit} className="mt-6">
                    <HeaderWithDescription
                        title="Change Password"
                        description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, itaque!"
                    />
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <label
                                htmlFor="new-password"
                                className="w-1/3 text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="w-2/3">
                                <InputField
                                    id="new-password"
                                    label="New Password"
                                    hideLabel
                                    value={password}
                                    type="password"
                                    name="new-password"
                                    onChange={(value) => setPassword(value)}
                                />
                            </div>
                        </div>
                        <div className="flex w-full items-center">
                            <label
                                htmlFor="confirm-password"
                                className="w-1/3 text-sm font-medium text-gray-700"
                            >
                                Confirm Password
                            </label>

                            <div className="w-2/3">
                                <InputField
                                    id="confirm-password"
                                    label="Confirm New Password"
                                    disabled={password === ""}
                                    value={confirmPassword}
                                    hideLabel
                                    type="password"
                                    name="confirm-password"
                                    onChange={(value) => setConfirmPassword(value)}
                                />
                            </div>
                        </div>
                    </div>

                    {password !== "" && (
                        <div className="mb-4 mt-4">
                            <PasswordStrengthChecker password={password} />
                        </div>
                    )}

                    <div className="mt-4">
                        <CustomButton
                            title={isUpdatingPassword ? "Updating..." : "Update Password"}
                            onClick={handleChangePasswordSubmit}
                            disabled={isUpdatingPassword || password === ""}
                        />
                    </div>
                </form>

                <div className="mt-6">
                    <HeaderWithDescription
                        title="Irreversible Operations"
                        description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, itaque!"
                        color="text-red-600"
                    />

                    <button
                        onClick={handleDeleteAccount}
                        className="rounded-md border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                        Delete Profile
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserProfilePage;
