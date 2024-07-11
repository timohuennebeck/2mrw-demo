"use client";

import React from "react";
import Link from "next/link";
import { EnvelopeIcon } from "@heroicons/react/16/solid";

const EmailConfirmationPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <EnvelopeIcon className="size-12" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">Check Your Email</h2>
                <p className="text-gray-600 mb-6">
                    We've sent a confirmation link to Your email address. Please click the link
                    inside it to activate Your account.
                </p>
                <p className="text-sm text-gray-500 mb-4 italic">
                    If You don't see the email, please check Your spam folder.
                </p>

                <Link
                    href="/"
                    className="block w-full bg-black text-white rounded-md py-2 hover:bg-gray-800 transition duration-300 mt-6"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
};

export default EmailConfirmationPage;
