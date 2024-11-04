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
            onSuccess?.();
            if (redirectPath) {
                router.replace(redirectPath); // clean up the URL without the success parameter
            }
        }
    }, [searchParams, router, onSuccess, redirectPath]);
};

export default useSuccessParam;
