import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface UseSuccessParamProps {
    onSuccess: () => void;
    redirectPath: string;
}

const useSuccessParam = ({ onSuccess, redirectPath }: UseSuccessParamProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const success = searchParams.get("success");
        if (success === "true") {
            // store in ref to prevent multiple triggers
            const timeoutId = setTimeout(() => {
                onSuccess?.();
                if (redirectPath) {
                    router.replace(redirectPath);
                }
            }, 1000);

            return () => clearTimeout(timeoutId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams.get("success")]); // only depend on the success param value
};

export default useSuccessParam;
