"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useSession } from "@/context/SessionContext";
import InputField from "@/components/InputField";
import HeaderWithDescription from "@/components/HeaderWithDescription";
import PasswordStrengthChecker from "@/components/PasswordStrengthChecker";
import CustomButton from "@/components/CustomButton";
import Image from "next/image";
import { AlertTriangle, Loader, UserRound } from "lucide-react";
import { updateUserProfileImage, updateUserPassword } from "./action";
import CustomPopup from "@/components/CustomPopup";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/services/integration/client";
import { TextConstants } from "@/constants/TextConstants";
import { validateEmailFormat } from "@/utils/validators/formatValidator";
import { createSupabasePowerUserClient } from "@/services/integration/admin";
import { useUser } from "@/context/UserContext";

const _updateUserName = async (userId: string, firstName: string) => {
    const supabase = createClient();

    const { error } = await supabase
        .from("users")
        .update({
            first_name: firstName,
        })
        .eq("id", userId);

    const { error: authError } = await supabase.auth.updateUser({
        data: {
            full_name: firstName,
        },
    });

    if (error || authError) {
        return { error: "Error updating first name" };
    }
};

const _checkForEmptyFieldPersonalInformation = (firstName: string, email: string) => {
    return firstName === "" || email === "";
};

const _checkForEmptyFieldPassword = (password: string, confirmPassword: string) => {
    return password === "" || confirmPassword === "";
};

const UserProfilePage = () => {
    const { authUser } = useSession();
    const { dbUser } = useUser();

    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userProfileImageUrl, setUserProfileImageUrl] = useState<string | null>(null);

    const [isUpdatingPersonalInfo, setIsUpdatingPersonalInfo] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
    const [showDeleteAccountPopup, setShowDeleteAccountPopup] = useState(false);
    const [deletingInProgress, setDeletingInProgress] = useState(false);

    const hasShownToastRef = useRef(false);

    useEffect(() => {
        const message = searchParams.get("message");
        if (message === "email-updated" && !hasShownToastRef.current) {
            // prevent the toast from being shown multiple times due to useEffect being triggered multiple times
            hasShownToastRef.current = true;
            // requires a timeout to ensure the toast doesn't get lost in the render cycle
            setTimeout(() => {
                toast.success("Your email has been updated");
            }, 100);
            router.replace("/user-profile", { scroll: false });
        }
    }, [searchParams, router]);

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
        if (!validateEmailFormat(email)) {
            toast.error(TextConstants.ERROR__INVALID_EMAIL);
            return;
        }

        setIsUpdatingPersonalInfo(true);

        if (email !== dbUser?.email) {
            /**
             * sends a confirmation email to the new email address
             * the user will have to click on the link in the email and will be redirect to /auth/confirm
             * which will then verify his credentials and afterwards update the email in supabase
             */

            const { error } = await supabase.auth.updateUser({
                email: email,
            });
            setIsUpdatingPersonalInfo(false);
            toast.info("To update the email, please confirm in the email we just sent.");

            if (error) {
                setIsUpdatingPersonalInfo(false);
                toast.error(error.message);
            }
        }

        if (firstName !== dbUser?.first_name) {
            const result = await _updateUserName(authUser?.id ?? "", firstName);

            if (result?.error) {
                setIsUpdatingPersonalInfo(false);
                toast.error(result.error);
            } else {
                setIsUpdatingPersonalInfo(false);
                toast.success("Your name has been updated!");
            }
        }
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

    const handleDeletionConfirmation = async () => {
        try {
            const adminSupabase = await createSupabasePowerUserClient();
            const userId = authUser?.id ?? "";

            setDeletingInProgress(true);

            // delete related records first (order matters due to foreign key constraints)
            await adminSupabase.from("free_trials").delete().eq("user_id", userId);

            await adminSupabase.from("user_subscriptions").delete().eq("user_id", userId);

            await adminSupabase.from("users").delete().eq("id", userId);

            const { error: authError } = await adminSupabase.auth.admin.deleteUser(userId);

            if (authError) {
                throw new Error(authError.message);
            }

            router.push("/auth/sign-in");

            setTimeout(() => {
                setDeletingInProgress(false);
                toast.success("Your account has been deleted");
            }, 1250);
        } catch (error) {
            setDeletingInProgress(false);
            toast.error("Failed to delete account");
            console.error("Error deleting account:", error);
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
                    mainButtonColor="bg-red-600 hover:bg-red-700 text-white"
                    mainButtonText="Confirm Deletion"
                    mainButtonIsLoading={deletingInProgress}
                    onConfirm={handleDeletionConfirmation}
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
                                    placeholder="Elon Musk"
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
                                    placeholder="m@example.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <CustomButton
                            title="Save Personal Information"
                            onClick={handlePersonalInfoSubmit}
                            disabled={
                                isUpdatingPersonalInfo ||
                                !hasPersonalInfoChanged() ||
                                _checkForEmptyFieldPersonalInformation(firstName, email)
                            }
                            isLoading={isUpdatingPersonalInfo}
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
                                    placeholder="********"
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
                                    placeholder="********"
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
                            title="Update Password"
                            onClick={handleChangePasswordSubmit}
                            disabled={
                                isUpdatingPassword ||
                                _checkForEmptyFieldPassword(password, confirmPassword)
                            }
                            isLoading={isUpdatingPassword}
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
