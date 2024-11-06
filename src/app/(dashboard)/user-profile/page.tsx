"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "@/context/SessionContext";
import useUser from "@/hooks/useUser";
import InputField from "@/components/InputField";
import HeaderWithDescription from "@/components/HeaderWithDescription";
import PasswordStrengthChecker from "@/components/PasswordStrengthChecker";
import CustomButton from "@/components/CustomButton";
import Image from "next/image";
import { AlertTriangle, Loader, UserRound } from "lucide-react";
import { updateUserProfileImage, updateUserEmail, updateUserPassword } from "./action";
import CustomPopup from "@/components/CustomPopup";

const UserProfilePage = () => {
    const { authUser } = useSession();
    const { dbUser } = useUser(authUser?.id ?? "");

    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userProfileImageUrl, setUserProfileImageUrl] = useState<string | null>(null);

    const [isUpdatingPersonalInfo, setIsUpdatingPersonalInfo] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
    const [pendingEmail, setPendingEmail] = useState<string | null>(null);
    const [showDeleteAccountPopup, setShowDeleteAccountPopup] = useState(false);

    useEffect(() => {
        if (dbUser) {
            setFirstName(dbUser.first_name);
            setEmail(dbUser.email);
            setUserProfileImageUrl(dbUser.profile_image_url ?? null);
            setIsLoading(false);
        }
    }, [dbUser]);

    const hasPersonalInfoChanged = () => {
        if (isLoading || !dbUser) return false;
        return firstName !== dbUser.first_name || email !== dbUser.email;
    };

    const handlePersonalInfoSubmit = async () => {
        setIsUpdatingPersonalInfo(true);

        if (email !== dbUser?.email) {
            await updateUserEmail(authUser?.id ?? "", email); // if email changed, request email update
        }

        setIsUpdatingPersonalInfo(false);
    };

    const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploadingProfileImage(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            const result = await updateUserProfileImage({
                profileImageUrl: userProfileImageUrl ?? "",
                userId: authUser?.id ?? "",
                formData,
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                setUserProfileImageUrl(result.publicUrl ?? null);
                toast.success("Profile image has been updated.");
            }
        } finally {
            setIsUploadingProfileImage(false);
        }
    };

    const handleChangePasswordSubmit = async () => {
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setIsUpdatingPassword(true);
            const result = await updateUserPassword(password);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Password updated");
                setPassword("");
                setConfirmPassword("");
            }
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    return (
        <>
            {showDeleteAccountPopup && (
                <CustomPopup
                    title="Lorem Ipsum"
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, itaque!"
                    icon={<AlertTriangle size={32} strokeWidth={1.5} className="text-red-500" />}
                    iconBackgroundColor="bg-red-100"
                    mainButtonColor="bg-red-600 hover:bg-red-700"
                    mainButtonText="Confirm Deletion"
                    onConfirm={() => {}}
                    onCancel={() => setShowDeleteAccountPopup(false)}
                />
            )}

            <div className="container h-full max-w-3xl bg-white">
                <HeaderWithDescription
                    title="Personal Profile"
                    isPageHeader
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, itaque!"
                />

                <div className="flex items-center">
                    <div className="mr-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
                        {isUploadingProfileImage ? (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                                <Loader className="h-6 w-6 animate-spin" />
                            </div>
                        ) : userProfileImageUrl ? (
                            <Image
                                src={userProfileImageUrl}
                                alt="Profile avatar"
                                className="h-full w-full rounded-full object-cover"
                                sizes="100vw"
                                width={0}
                                height={0}
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                                <UserRound size={48} strokeWidth={1.5} />
                            </div>
                        )}
                    </div>

                    <div>
                        {/* hidden so we can use a styled button instead */}
                        <input
                            type="file"
                            id="avatar"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfileImageUpload}
                        />
                        <CustomButton
                            title={isUploadingProfileImage ? "Uploading..." : "Change avatar"}
                            onClick={() => document.getElementById("avatar")?.click()}
                            disabled={isUploadingProfileImage}
                        />
                    </div>
                </div>

                <form onSubmit={handlePersonalInfoSubmit} className="mt-6">
                    <HeaderWithDescription
                        title="Personal Information"
                        description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, itaque!"
                    />
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                First name
                            </label>
                            <div className="w-2/3">
                                <InputField
                                    id="name"
                                    label="First Name"
                                    hideLabel
                                    type="text"
                                    name="name"
                                    value={firstName}
                                    onChange={(value) => setFirstName(value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">
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
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="new-password"
                                className="text-sm font-medium text-gray-700"
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
                        <div className="flex w-full items-center justify-between">
                            <label
                                htmlFor="confirm-password"
                                className="text-sm font-medium text-gray-700"
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
                        onClick={() => setShowDeleteAccountPopup(true)}
                        className="rounded-md border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                        Delete Profile
                    </button>
                </div>
            </div>
        </>
    );
};

export default UserProfilePage;
