"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/services/supabase/client";
import { User } from "@supabase/supabase-js";
import DashboardLayout from "../DashboardLayout";

const UserProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                setName(user.user_metadata.full_name || "");
                setEmail(user.email || "");
            }
        };
        getUser();
    }, []);

    const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Implement logic to update personal information
        console.log("Personal info update submitted", { name, email });
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Implement logic to update password
        console.log("Password update submitted", { currentPassword, newPassword, confirmPassword });
    };

    const handleDeleteAccount = () => {
        // Implement logic to delete account
        console.log("Delete account requested");
    };

    return (
        <DashboardLayout>
            <div className="container max-w-3xl bg-white">
                <h2 className="mb-2 text-xl font-medium">Personal Profile</h2>
                <p className="mb-6 text-sm text-gray-500">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, itaque!
                </p>
                <div className="mb-6 flex items-center">
                    <div className="mr-6 h-24 w-24 rounded-full bg-gray-200">
                        {/* Placeholder for profile image */}
                    </div>
                    <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">
                        Change avatar
                    </button>
                </div>

                <form onSubmit={handlePersonalInfoSubmit}>
                    <h3 className="mb-4 mt-8 text-lg font-medium">Personal Information</h3>
                    <p className="mb-6 text-sm text-gray-500">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur,
                        itaque!
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <label
                                htmlFor="name"
                                className="w-1/3 text-sm font-medium text-gray-700"
                            >
                                Full name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-2/3 rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>
                        <div className="flex items-center">
                            <label
                                htmlFor="email"
                                className="w-1/3 text-sm font-medium text-gray-700"
                            >
                                Email address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-2/3 rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>
                        <div className="flex items-center">
                            <label
                                htmlFor="timezone"
                                className="w-1/3 text-sm font-medium text-gray-700"
                            >
                                UTC
                            </label>
                            <input
                                type="text"
                                id="timezone"
                                value="UTC+08:00 Kuala Lumpur, Singapore"
                                readOnly
                                className="w-2/3 rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Save Personal Information
                        </button>
                    </div>
                </form>

                <form onSubmit={handlePasswordSubmit}>
                    <h3 className="mb-4 mt-8 text-lg font-medium">Change Password</h3>
                    <p className="mb-6 text-sm text-gray-500">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur,
                        itaque!
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <label
                                htmlFor="current-password"
                                className="w-1/3 text-sm font-medium text-gray-700"
                            >
                                Current Password
                            </label>
                            <input
                                type="password"
                                id="current-password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-2/3 rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>
                        <div className="flex items-center">
                            <label
                                htmlFor="new-password"
                                className="w-1/3 text-sm font-medium text-gray-700"
                            >
                                New Password
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-2/3 rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>
                        <div className="flex items-center">
                            <label
                                htmlFor="confirm-password"
                                className="w-1/3 text-sm font-medium text-gray-700"
                            >
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-2/3 rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Update Password
                        </button>
                    </div>
                </form>

                <div className="mt-8">
                    <h3 className="mb-4 text-lg font-medium text-red-600">
                        Irreversible Operations
                    </h3>
                    <p className="mb-4 text-sm text-gray-500">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur,
                        itaque!
                    </p>
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
