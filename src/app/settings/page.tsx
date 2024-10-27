"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/services/supabase/client";
import { User } from "@supabase/supabase-js";
import DashboardLayout from "../DashboardLayout";

const SettingsPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [theme, setTheme] = useState("light");
    const [language, setLanguage] = useState("en");
    const [colorTheme, setColorTheme] = useState("#3B82F6");

    const colorOptions = [
        "#1E293B", // Navy
        "#4F46E5", // Indigo
        "#7C3AED", // Purple
        "#3B82F6", // Blue
        "#0EA5E9", // Light Blue
        "#06B6D4", // Cyan
        "#14B8A6", // Teal
        "#10B981", // Green
        "#F5F5F5", // Light Gray
    ];

    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                // Load user preferences from Supabase
                const { data, error } = await supabase
                    .from("user_preferences")
                    .select("email_notifications, theme, language")
                    .eq("user_id", user.id)
                    .single();

                if (data && !error) {
                    setEmailNotifications(data.email_notifications);
                    setTheme(data.theme);
                    setLanguage(data.language);
                }
            }
        };
        getUser();
    }, []);

    const handleSaveSettings = async () => {
        if (!user) return;

        const { data, error } = await supabase.from("user_preferences").upsert(
            {
                user_id: user.id,
                email_notifications: emailNotifications,
                theme,
                language,
            },
            { onConflict: "user_id" },
        );

        if (error) {
            console.error("Error saving settings:", error);
        } else {
            console.log("Settings saved successfully");
        }
    };

    return (
        <DashboardLayout>
            <div className="container max-w-3xl bg-white">
                <h2 className="mb-2 text-xl font-medium">Settings</h2>
                <p className="mb-6 text-sm text-gray-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>

                <section className="mb-8">
                    <h3 className="mb-4 text-lg font-medium">Choose a color theme</h3>
                    <div className="flex space-x-2">
                        {colorOptions.map((color) => (
                            <button
                                key={color}
                                className={`h-8 w-8 rounded-full ${
                                    colorTheme === color ? "ring-2 ring-blue-500 ring-offset-2" : ""
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => setColorTheme(color)}
                            />
                        ))}
                        <input
                            type="text"
                            value={colorTheme}
                            onChange={(e) => setColorTheme(e.target.value)}
                            className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm"
                            placeholder="#FFFFFF"
                        />
                    </div>
                </section>

                <section className="mb-8">
                    <h3 className="mb-2 text-lg font-medium">Preferences</h3>
                    <p className="mb-6 text-sm text-gray-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label htmlFor="theme" className="text-sm font-medium text-gray-700">
                                Theme
                            </label>
                            <select
                                id="theme"
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="language" className="text-sm font-medium text-gray-700">
                                Language
                            </label>
                            <select
                                id="language"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                            </select>
                        </div>
                    </div>
                </section>

                <div className="mt-6 flex space-x-4">
                    <button
                        onClick={() => {
                            /* Add cancel logic here */
                        }}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveSettings}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        style={{ backgroundColor: colorTheme }}
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SettingsPage;
