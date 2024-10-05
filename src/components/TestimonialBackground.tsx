import { TextConstants } from "@/constants/TextConstants";

interface TestimonialBackgroundProps {
    children: JSX.Element;
}

const TestimonialBackground = ({ children }: TestimonialBackgroundProps) => {
    return (
        <div className="flex h-screen gap-8 p-8">
            {children}

            <div className="hidden w-1/2 flex-col justify-between bg-white py-8 lg:flex">
                <span className="text-xl font-semibold text-black">{TextConstants.TEXT__MICROSOFT}</span>

                <div className="flex flex-col gap-2">
                    <p className="text-black">{TextConstants.TEXT__THIS_LIB_HAS_SAVED_ME}</p>
                    <p className="text-sm font-medium text-black">{TextConstants.TEXT__TIMO_HUENNEBECK}</p>
                </div>
            </div>
        </div>
    );
};

export default TestimonialBackground;
