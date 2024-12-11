import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ConfirmationPageProps {
    title: string;
    description: string;
    redirectPath: string;
    buttonText: string;
}

const ConfirmationPage = ({
    title,
    description,
    redirectPath,
    buttonText,
}: ConfirmationPageProps) => {
    const router = useRouter();
    const [timer, setTimer] = useState(5);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    router.push(redirectPath);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [router, redirectPath]);

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="mx-auto flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    <Image
                        src="https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg"
                        alt="logo"
                        width={40}
                        height={40}
                    />
                </div>

                <div>
                    <h1 className="mb-2 text-2xl font-semibold">{title}</h1>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>

                <Button onClick={() => router.push(redirectPath)} className="w-full">
                    {buttonText}
                </Button>

                <p className="text-center text-sm text-gray-400">
                    You will be redirected in {timer} seconds...
                </p>
            </div>
        </div>
    );
};

export default ConfirmationPage;
