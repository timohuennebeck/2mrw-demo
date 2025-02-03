import { Button } from "@/components/ui/button";
import TexturedBackground from "@/components/ui/textured-background";
import { Manrope } from "next/font/google";
import Link from "next/link";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

export default function NotFound() {
    return (
        <>
            <TexturedBackground />

            <div
                className={`${manrope.variable} flex min-h-screen flex-col items-center justify-center px-4 font-manrope`}
            >
                <div className="flex max-w-2xl flex-col items-center text-center">
                    <span className="mb-4 text-sm font-medium text-blue-600">404 ERROR</span>
                    <h1 className="mb-4 text-4xl font-medium tracking-tight md:text-5xl">
                        Oops! Lost in{" "}
                        <span className="relative mt-4 inline-block whitespace-nowrap bg-blue-600 p-2 text-white">
                            Digital Space
                        </span>
                    </h1>
                    <p className="mb-8 text-muted-foreground">
                        Looks like the page you're looking for doesn't exist. Don't worry—let's get
                        you back on track!
                    </p>
                    <Button asChild size="lg">
                        <Link href="/">Return to Homepage</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
