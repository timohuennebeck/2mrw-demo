import { useEffect, RefObject } from "react";

interface UseClickOutsideProps {
    ref: RefObject<HTMLElement>;
    handler: () => void;
    enabled?: boolean;
}

const useClickOutside = ({ ref, handler, enabled = true }: UseClickOutsideProps) => {
    useEffect(() => {
        if (!enabled) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, handler, enabled]);
};

export default useClickOutside;
