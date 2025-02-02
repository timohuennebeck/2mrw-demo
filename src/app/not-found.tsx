import { Button } from "@/components/ui/button";
import { Manrope } from "next/font/google";
import Link from "next/link";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

export default function NotFound() {
    return (
        <>
            {/* light theme background */}
            <div className="fixed inset-0 -z-10 h-full w-full opacity-100 dark:opacity-0">
                <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] opacity-100 [background-size:16px_16px]" />
            </div>

            {/* dark theme background */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-black opacity-0 dark:opacity-100">
                <div className="h-full w-full bg-[radial-gradient(#1f2937_1px,transparent_1px)] opacity-0 [background-size:16px_16px] dark:opacity-50" />
            </div>

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
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo repellat
                        deserunt totam laudantium eum nemo sapiente delectus voluptatem omnis
                        maiores!
                    </p>
                    <Button asChild size="lg">
                        <Link href="/">Return to Homepage</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
