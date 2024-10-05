import Link from "next/link";
import React from "react";

function SignUpLink({
    title,
    buttonText,
    link,
}: {
    title: string;
    buttonText: string;
    link: string;
}) {
    return (
        <p className="text-center text-sm text-neutral-600 mb-4">
            {title}{" "}
            <Link
                href={link ?? ""}
                className="font-medium text-black hover:text-neutral-800 transition-colors"
            >
                {buttonText}
            </Link>
        </p>
    );
}

export default SignUpLink;
