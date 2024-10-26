import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
            <h1 className="mb-2 text-4xl font-bold md:text-5xl">404 - Oops! Lost in Space.</h1>
            <p className="mb-8 text-lg text-gray-600">
                The requested page was not found.
            </p>
            <Link
                href="/"
                className="rounded-md bg-gray-900 px-6 py-3 text-white transition-colors hover:bg-gray-800"
            >
                Return to website
            </Link>
        </div>
    );
}
